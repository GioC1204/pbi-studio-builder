import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import {
  Download, Plus, Trash2, Settings, ChevronRight,
  BarChart2, Shield, Database, Palette, Eye, Loader2,
} from 'lucide-react';

const Section = ({ title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-4"
  >
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-surface-400 mb-4">{title}</h2>
      <Separator className="mb-6" />
    </div>
    {children}
  </motion.section>
);

export default function ShowcasePage() {
  const [loading, setLoading] = useState(false);

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-50 p-8">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-surface-900">
            Showcase — <span className="text-gradient">Componentes Shadcn/ui</span>
          </h1>
          <p className="text-surface-500 text-sm">Todos los componentes disponibles para AURORA</p>
        </div>

        {/* Buttons — Variantes */}
        <Section title="Botones — Variantes">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </Section>

        {/* Buttons — Tamaños */}
        <Section title="Botones — Tamaños">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">Large</Button>
            <Button size="default">Default</Button>
            <Button size="sm">Small</Button>
            <Button size="icon"><Settings className="h-4 w-4" /></Button>
          </div>
        </Section>

        {/* Buttons — Con íconos */}
        <Section title="Botones — Con íconos">
          <div className="flex flex-wrap gap-3">
            <Button><Download className="mr-2 h-4 w-4" /> Descargar .pbip</Button>
            <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Nuevo proyecto</Button>
            <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</Button>
            <Button variant="secondary"><BarChart2 className="mr-2 h-4 w-4" /> Ver reporte</Button>
          </div>
        </Section>

        {/* Buttons — Estados */}
        <Section title="Botones — Estados">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleLoading} disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</> : 'Generar dashboard'}
            </Button>
            <Button disabled>Deshabilitado</Button>
            <Button variant="outline" disabled>Sin acceso</Button>
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Error</Badge>
            {/* Custom con clases del proyecto */}
            <span className="badge-success">Completado</span>
            <span className="badge-warning">Pendiente</span>
            <span className="badge-error">Fallido</span>
            <span className="badge-brand">Power BI</span>
          </div>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre de la tabla</Label>
              <Input placeholder="ej. Ventas2024" />
            </div>
            <div className="space-y-2">
              <Label>Fuente de datos</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="sql">SQL Server</SelectItem>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Descripción del proyecto</Label>
              <Textarea placeholder="Describe qué datos quieres visualizar..." rows={3} />
            </div>
          </div>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Database, title: 'Fuente de datos', desc: 'Conecta CSV, SQL o Excel', color: 'text-accent-500' },
              { icon: Palette,  title: 'Tema visual',     desc: 'Colores, fuentes y logo',  color: 'text-brand-500' },
              { icon: Shield,   title: 'Seguridad RLS',   desc: 'Roles y permisos por tabla', color: 'text-success' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <Card key={title} className="card-premium cursor-pointer">
                <CardHeader>
                  <Icon className={`h-5 w-5 ${color} mb-1`} />
                  <CardTitle className="text-sm">{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Configurar <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Section>

        {/* Dialog */}
        <Section title="Dialog y Sheet">
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline"><Eye className="mr-2 h-4 w-4" /> Ver Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar generación</DialogTitle>
                  <DialogDescription>
                    POLARIS generará el archivo .pbip con los datos configurados. ¿Continuar?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button><Download className="mr-2 h-4 w-4" /> Generar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Ver Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Configuración de tema</SheetTitle>
                  <SheetDescription>Personaliza colores y fuentes del dashboard.</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Color primario</Label>
                    <Input placeholder="#F2C811" />
                  </div>
                  <div className="space-y-2">
                    <Label>Fuente</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecciona fuente" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="segoe">Segoe UI</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Aplicar tema</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Section>

      </div>
    </div>
  );
}
