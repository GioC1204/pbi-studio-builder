'use strict';

const crypto = require('crypto');

// ── Encryption helpers (AES-256-CBC) ─────────────

const ALGO = 'aes-256-cbc';

function getKey() {
  const raw = process.env.ENCRYPTION_KEY || 'pbi-studio-builder-default-key-32b';
  return crypto.createHash('sha256').update(raw).digest(); // always 32 bytes
}

exports.encrypt = (obj) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(obj), 'utf8'), cipher.final()]);
  return { iv: iv.toString('hex'), data: encrypted.toString('hex') };
};

exports.decrypt = (stored) => {
  const iv = Buffer.from(stored.iv, 'hex');
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(stored.data, 'hex')), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
};

// ── Type inference (reused from file upload flow) ─

function inferType(values) {
  const nonNull = values.filter((v) => v !== undefined && v !== null && v !== '');
  if (nonNull.length === 0) return 'text';
  if (nonNull.every((v) => Number.isInteger(Number(v)) && !isNaN(Number(v)))) return 'integer';
  if (nonNull.every((v) => !isNaN(Number(v)))) return 'decimal';
  if (nonNull.every((v) => !isNaN(Date.parse(String(v))))) return 'date';
  return 'text';
}

function buildColumnDefs(rows, headers) {
  return headers.map((h, i) => ({
    name: String(h).trim(),
    type: inferType(rows.map((r) => r[i] ?? r[h])),
    description: '',
  }));
}

// ── AWS S3 ────────────────────────────────────────

/**
 * Test S3 connection and extract schema from CSV/Parquet file.
 * @param {Object} creds - { bucket, region, accessKeyId, secretAccessKey, filePath }
 * @returns {Object} { tables: [{ name, columns, sample_rows }] }
 */
exports.testS3 = async (creds) => {
  const { S3Client, GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

  const client = new S3Client({
    region: creds.region || 'us-east-1',
    credentials: {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey,
    },
  });

  // Verify object exists
  await client.send(new HeadObjectCommand({ Bucket: creds.bucket, Key: creds.filePath }));

  // Download first 64KB to infer schema
  const response = await client.send(new GetObjectCommand({
    Bucket: creds.bucket,
    Key: creds.filePath,
    Range: 'bytes=0-65535',
  }));

  const chunks = [];
  for await (const chunk of response.Body) chunks.push(chunk);
  const content = Buffer.concat(chunks).toString('utf-8');

  // Parse CSV
  const lines = content.split('\n').filter(Boolean);
  if (lines.length < 2) throw new Error('El archivo S3 parece estar vacío o no es CSV.');

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const sampleRows = lines.slice(1, 6).map((line) =>
    line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
  );

  const tableName = creds.filePath.split('/').pop().replace(/\.[^.]+$/, '');
  const columns = buildColumnDefs(sampleRows, headers);

  return {
    tables: [{ name: tableName, columns, is_fact_table: false, sample_rows: sampleRows }],
  };
};

// ── PostgreSQL ────────────────────────────────────

/**
 * Test PostgreSQL connection and extract schema from a table.
 * @param {Object} creds - { host, port, database, user, password, tableName }
 */
exports.testPostgres = async (creds) => {
  const { Pool } = require('pg');

  const pool = new Pool({
    host: creds.host,
    port: Number(creds.port) || 5432,
    database: creds.database,
    user: creds.user,
    password: creds.password,
    connectionTimeoutMillis: 8000,
    ssl: creds.ssl ? { rejectUnauthorized: false } : false,
  });

  try {
    // Get column info from information_schema
    const colResult = await pool.query(
      `SELECT column_name, data_type
       FROM information_schema.columns
       WHERE table_name = $1
       ORDER BY ordinal_position`,
      [creds.tableName]
    );

    if (colResult.rows.length === 0) {
      throw new Error(`Tabla "${creds.tableName}" no encontrada en la base de datos.`);
    }

    // Get sample rows
    const sampleResult = await pool.query(
      `SELECT * FROM "${creds.tableName}" LIMIT 5`
    );

    const headers = colResult.rows.map((r) => r.column_name);
    const sampleRows = sampleResult.rows.map((row) => headers.map((h) => row[h]));

    const columns = colResult.rows.map((r) => ({
      name: r.column_name,
      type: mapPgType(r.data_type),
      description: '',
    }));

    return {
      tables: [{
        name: creds.tableName,
        columns,
        is_fact_table: false,
        sample_rows: sampleRows,
      }],
    };
  } finally {
    await pool.end();
  }
};

function mapPgType(pgType) {
  if (/int|serial/i.test(pgType)) return 'integer';
  if (/numeric|decimal|float|real|double/i.test(pgType)) return 'decimal';
  if (/date|timestamp/i.test(pgType)) return 'date';
  if (/bool/i.test(pgType)) return 'boolean';
  return 'text';
}

// ── MySQL ─────────────────────────────────────────

/**
 * Test MySQL connection and extract schema from a table.
 * @param {Object} creds - { host, port, database, user, password, tableName }
 */
exports.testMySQL = async (creds) => {
  const mysql = require('mysql2/promise');

  const conn = await mysql.createConnection({
    host: creds.host,
    port: Number(creds.port) || 3306,
    database: creds.database,
    user: creds.user,
    password: creds.password,
    connectTimeout: 8000,
  });

  try {
    const [colRows] = await conn.query(
      `SELECT COLUMN_NAME, DATA_TYPE
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
       ORDER BY ORDINAL_POSITION`,
      [creds.database, creds.tableName]
    );

    if (colRows.length === 0) {
      throw new Error(`Tabla "${creds.tableName}" no encontrada.`);
    }

    const [sampleRows] = await conn.query(`SELECT * FROM \`${creds.tableName}\` LIMIT 5`);
    const headers = colRows.map((r) => r.COLUMN_NAME);
    const sampleArr = sampleRows.map((row) => headers.map((h) => row[h]));

    const columns = colRows.map((r) => ({
      name: r.COLUMN_NAME,
      type: mapMysqlType(r.DATA_TYPE),
      description: '',
    }));

    return {
      tables: [{
        name: creds.tableName,
        columns,
        is_fact_table: false,
        sample_rows: sampleArr,
      }],
    };
  } finally {
    await conn.end();
  }
};

function mapMysqlType(mysqlType) {
  if (/int|tinyint|smallint|mediumint|bigint/i.test(mysqlType)) return 'integer';
  if (/decimal|float|double|numeric/i.test(mysqlType)) return 'decimal';
  if (/date|datetime|timestamp/i.test(mysqlType)) return 'date';
  if (/bit|bool/i.test(mysqlType)) return 'boolean';
  return 'text';
}

// ── SQL Server ────────────────────────────────────

/**
 * Test SQL Server connection and extract schema from a table.
 * @param {Object} creds - { server, database, user, password, tableName, encrypt }
 */
exports.testSQLServer = async (creds) => {
  const sql = require('mssql');

  const config = {
    server: creds.server,
    database: creds.database,
    user: creds.user,
    password: creds.password,
    options: {
      encrypt: creds.encrypt !== false,
      trustServerCertificate: true,
      connectTimeout: 8000,
    },
  };

  const pool = await sql.connect(config);
  try {
    const colResult = await pool.request().query(
      `SELECT COLUMN_NAME, DATA_TYPE
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_NAME = '${creds.tableName.replace(/'/g, "''")}'
       ORDER BY ORDINAL_POSITION`
    );

    if (colResult.recordset.length === 0) {
      throw new Error(`Tabla "${creds.tableName}" no encontrada.`);
    }

    const sampleResult = await pool.request().query(
      `SELECT TOP 5 * FROM [${creds.tableName.replace(/]/g, ']]')}]`
    );

    const headers = colResult.recordset.map((r) => r.COLUMN_NAME);
    const sampleArr = sampleResult.recordset.map((row) => headers.map((h) => row[h]));

    const columns = colResult.recordset.map((r) => ({
      name: r.COLUMN_NAME,
      type: mapSqlServerType(r.DATA_TYPE),
      description: '',
    }));

    return {
      tables: [{
        name: creds.tableName,
        columns,
        is_fact_table: false,
        sample_rows: sampleArr,
      }],
    };
  } finally {
    await pool.close();
  }
};

function mapSqlServerType(ssType) {
  if (/int|bigint|smallint|tinyint/i.test(ssType)) return 'integer';
  if (/decimal|numeric|float|real|money/i.test(ssType)) return 'decimal';
  if (/date|datetime|time/i.test(ssType)) return 'date';
  if (/bit/i.test(ssType)) return 'boolean';
  return 'text';
}

// ── Dispatcher ────────────────────────────────────

/**
 * Route to the correct connector based on type.
 * @param {string} type - 's3' | 'postgres' | 'mysql' | 'sqlserver'
 * @param {Object} credentials
 * @returns {Object} { tables }
 */
exports.connect = async (type, credentials) => {
  switch (type) {
    case 's3':        return exports.testS3(credentials);
    case 'postgres':  return exports.testPostgres(credentials);
    case 'mysql':     return exports.testMySQL(credentials);
    case 'sqlserver': return exports.testSQLServer(credentials);
    default:          throw new Error(`Tipo de conexión no soportado: ${type}`);
  }
};
