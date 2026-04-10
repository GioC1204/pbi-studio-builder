-- Power BI Studio Builder — Database Schema
-- PostgreSQL 15+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name        VARCHAR(255),
    is_admin    BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name               VARCHAR(255) NOT NULL DEFAULT 'Nuevo Proyecto',
    status             VARCHAR(50) NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft', 'generating', 'completed', 'error')),
    modules            JSONB NOT NULL DEFAULT '{
        "1": {"completed": false, "data": {}},
        "2": {"completed": false, "data": {}},
        "3": {"completed": false, "data": {}},
        "4": {"completed": false, "data": {}},
        "5": {"completed": false, "data": {}},
        "6": {"completed": false, "data": {}}
    }',
    connection_config  JSONB,   -- encrypted cloud connection credentials (AES-256)
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KPI Templates (predefined by sector)
CREATE TABLE IF NOT EXISTS kpi_templates (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector           VARCHAR(50) NOT NULL CHECK (sector IN ('retail', 'finanzas', 'logistica')),
    name             VARCHAR(255) NOT NULL,
    description_template TEXT NOT NULL,
    format           VARCHAR(50) NOT NULL,
    default_target   NUMERIC,
    aggregation      VARCHAR(20) NOT NULL DEFAULT 'SUM',
    keywords         TEXT[],        -- for fuzzy field matching
    is_approved      BOOLEAN NOT NULL DEFAULT true,
    created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kpi_templates_sector ON kpi_templates(sector);
CREATE INDEX IF NOT EXISTS idx_kpi_templates_approved ON kpi_templates(is_approved);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
