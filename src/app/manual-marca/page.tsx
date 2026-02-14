'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Palette,
  Type,
  Image as ImageIcon,
  Layout,
  Download,
  ExternalLink,
  Check,
  X,
  AlertTriangle,
  Loader2,
  FileText,
} from 'lucide-react';

// Brand Colors
const brandColors = [
  {
    name: 'Primary Blue',
    hex: '#00ade8',
    rgb: 'rgb(0, 173, 232)',
    usage: 'Cor principal da marca, usada em acentos, botões e elementos de destaque.',
    canUse: true,
  },
  {
    name: 'Slate 900',
    hex: '#0f172a',
    rgb: 'rgb(15, 23, 42)',
    usage: 'Texto principal, títulos e elementos de alta importância.',
    canUse: true,
  },
  {
    name: 'Slate 600',
    hex: '#475569',
    rgb: 'rgb(71, 85, 105)',
    usage: 'Texto secundário, descrições e elementos de menor importância.',
    canUse: true,
  },
  {
    name: 'Slate 400',
    hex: '#94a3b8',
    rgb: 'rgb(148, 163, 184)',
    usage: 'Texto terciário, placeholders e elementos desabilitados.',
    canUse: true,
  },
  {
    name: 'Slate 100',
    hex: '#f1f5f9',
    rgb: 'rgb(241, 245, 249)',
    usage: 'Backgrounds secundários, cards e áreas de destaque suave.',
    canUse: true,
  },
  {
    name: 'White',
    hex: '#ffffff',
    rgb: 'rgb(255, 255, 255)',
    usage: 'Background principal, texto em superfícies escuras.',
    canUse: true,
  },
  {
    name: 'Success Green',
    hex: '#10b981',
    rgb: 'rgb(16, 185, 129)',
    usage: 'Estados de sucesso, confirmações e feedback positivo.',
    canUse: true,
  },
  {
    name: 'Error Red',
    hex: '#ef4444',
    rgb: 'rgb(239, 68, 68)',
    usage: 'Estados de erro, alertas críticos e ações destrutivas.',
    canUse: true,
  },
];

// Forbidden colors
const forbiddenColors = [
  {
    name: 'Indigo',
    reason: 'Nunca usar tons de indigo ou azul escuro que não sejam da paleta slate.',
  },
  {
    name: 'Cores vibrantes aleatórias',
    reason: 'Manter consistência com a paleta definida. Não usar cores que não estejam no manual.',
  },
];

// Typography
const typography = [
  {
    name: 'Display / H1',
    font: 'Montserrat Bold',
    size: '48px / 3rem',
    weight: 700,
    lineHeight: 1.1,
    usage: 'Títulos principais, headers de páginas especiais.',
    example: 'ness.MKT',
  },
  {
    name: 'Heading 1',
    font: 'Montserrat Bold',
    size: '36px / 2.25rem',
    weight: 700,
    lineHeight: 1.2,
    usage: 'Títulos de seção, headers de página.',
    example: 'Manual da Marca',
  },
  {
    name: 'Heading 2',
    font: 'Montserrat Semibold',
    size: '30px / 1.875rem',
    weight: 600,
    lineHeight: 1.25,
    usage: 'Subtítulos, títulos de cards.',
    example: 'Cores da Marca',
  },
  {
    name: 'Heading 3',
    font: 'Montserrat Semibold',
    size: '24px / 1.5rem',
    weight: 600,
    lineHeight: 1.3,
    usage: 'Títulos menores, destaques.',
    example: 'Uso Correto',
  },
  {
    name: 'Body Large',
    font: 'Montserrat Regular',
    size: '18px / 1.125rem',
    weight: 400,
    lineHeight: 1.6,
    usage: 'Texto de destaque, introduções.',
    example: 'Este é um texto de corpo grande.',
  },
  {
    name: 'Body',
    font: 'Montserrat Regular',
    size: '16px / 1rem',
    weight: 400,
    lineHeight: 1.5,
    usage: 'Texto corrido, parágrafos.',
    example: 'Este é um texto de corpo padrão.',
  },
  {
    name: 'Body Small',
    font: 'Montserrat Regular',
    size: '14px / 0.875rem',
    weight: 400,
    lineHeight: 1.5,
    usage: 'Texto auxiliar, legendas.',
    example: 'Este é um texto de corpo pequeno.',
  },
  {
    name: 'Caption',
    font: 'Montserrat Regular',
    size: '12px / 0.75rem',
    weight: 400,
    lineHeight: 1.4,
    usage: 'Etiquetas, badges, informações extras.',
    example: 'CAPTION TEXT',
  },
];

// Logo Usage Rules
const logoRules = {
  correct: [
    {
      title: 'Logo Principal (Fundo Claro)',
      description: 'Use "ness." em slate-900 (#0f172a) com o ponto em #00ade8',
      preview: (
        <div className="bg-white p-4 rounded-lg border flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">ness<span className="text-[#00ade8]">.</span></span>
        </div>
      ),
    },
    {
      title: 'Logo Reversa (Fundo Escuro)',
      description: 'Use "ness." em branco (#ffffff) com o ponto em #00ade8',
      preview: (
        <div className="bg-slate-900 p-4 rounded-lg border flex items-center justify-center">
          <span className="text-2xl font-bold text-white">ness<span className="text-[#00ade8]">.</span></span>
        </div>
      ),
    },
    {
      title: 'Logo em Azul NESS',
      description: 'Use "ness." em branco com o ponto em branco sobre fundo azul',
      preview: (
        <div className="bg-[#00ade8] p-4 rounded-lg border flex items-center justify-center">
          <span className="text-2xl font-bold text-white">ness<span className="text-white">.</span></span>
        </div>
      ),
    },
    {
      title: 'Espaçamento Mínimo',
      description: 'Mantenha espaço livre ao redor da logo equivalente à altura do "n"',
      preview: (
        <div className="bg-slate-50 p-6 rounded-lg border flex items-center justify-center relative">
          <div className="absolute inset-2 border-2 border-dashed border-[#00ade8]/30 rounded"></div>
          <span className="text-2xl font-bold text-slate-900">ness<span className="text-[#00ade8]">.</span></span>
        </div>
      ),
    },
  ],
  incorrect: [
    {
      title: 'Cores Erradas',
      description: 'Nunca altere as cores da marca',
      preview: (
        <div className="bg-white p-4 rounded-lg border flex items-center justify-center">
          <span className="text-2xl font-bold text-purple-600">ness<span className="text-red-500">.</span></span>
        </div>
      ),
    },
    {
      title: 'Ponto em Branco',
      description: 'O ponto deve sempre ser #00ade8, exceto sobre fundo azul',
      preview: (
        <div className="bg-white p-4 rounded-lg border flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">ness<span className="text-slate-900">.</span></span>
        </div>
      ),
    },
    {
      title: 'Distorção',
      description: 'Nunca estique ou comprima a logo',
      preview: (
        <div className="bg-white p-4 rounded-lg border flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-900 transform scale-x-150">ness<span className="text-[#00ade8]">.</span></span>
        </div>
      ),
    },
    {
      title: 'Fundos Conflitantes',
      description: 'Não use sobre fundos que conflitem com a marca',
      preview: (
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-lg border flex items-center justify-center">
          <span className="text-2xl font-bold text-white">ness<span className="text-[#00ade8]">.</span></span>
        </div>
      ),
    },
  ],
};

// Spacing Scale
const spacingScale = [
  { name: '0', value: '0', pixels: '0px' },
  { name: '1', value: '0.25rem', pixels: '4px' },
  { name: '2', value: '0.5rem', pixels: '8px' },
  { name: '3', value: '0.75rem', pixels: '12px' },
  { name: '4', value: '1rem', pixels: '16px' },
  { name: '5', value: '1.25rem', pixels: '20px' },
  { name: '6', value: '1.5rem', pixels: '24px' },
  { name: '8', value: '2rem', pixels: '32px' },
  { name: '10', value: '2.5rem', pixels: '40px' },
  { name: '12', value: '3rem', pixels: '48px' },
  { name: '16', value: '4rem', pixels: '64px' },
  { name: '20', value: '5rem', pixels: '80px' },
  { name: '24', value: '6rem', pixels: '96px' },
];

export default function ManualMarcaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ade8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Manual da Marca</h1>
                <p className="text-xs text-slate-500">Guias e diretrizes da marca NESS</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-[#00ade8]/10 text-[#00ade8] border-[#00ade8]/20">
                v1.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Introduction */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[#00ade8]/10">
                <FileText className="h-6 w-6 text-[#00ade8]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Bem-vindo ao Manual da Marca NESS</h2>
                <p className="text-slate-600">
                  Este manual contém todas as diretrizes necessárias para manter a consistência da marca NESS 
                  em todos os pontos de contato. Siga estas regras para garantir uma comunicação visual 
                  coesa e profissional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="cores" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="cores" className="gap-2">
              <Palette className="h-4 w-4" />
              Cores
            </TabsTrigger>
            <TabsTrigger value="tipografia" className="gap-2">
              <Type className="h-4 w-4" />
              Tipografia
            </TabsTrigger>
            <TabsTrigger value="logo" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Logo
            </TabsTrigger>
            <TabsTrigger value="espacamento" className="gap-2">
              <Layout className="h-4 w-4" />
              Espaçamento
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="cores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-[#00ade8]" />
                  Paleta de Cores
                </CardTitle>
                <CardDescription>
                  Cores oficiais da marca NESS e suas aplicações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {brandColors.map((color) => (
                    <div key={color.hex} className="group">
                      <div
                        className="h-24 rounded-t-lg border border-b-0 relative cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(color.hex)}
                      >
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Badge variant="secondary" className="text-xs">
                            Copiar
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3 border rounded-b-lg bg-white">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{color.name}</span>
                          {color.canUse && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600 font-mono">{color.hex}</p>
                          <p className="text-xs text-slate-400 font-mono">{color.rgb}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Cores Proibidas
                </CardTitle>
                <CardDescription className="text-red-600">
                  Estas cores nunca devem ser utilizadas nos materiais da marca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {forbiddenColors.map((color, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-red-200">
                      <X className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900">{color.name}</p>
                        <p className="text-sm text-slate-600 mt-1">{color.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="tipografia" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-[#00ade8]" />
                  Tipografia
                </CardTitle>
                <CardDescription>
                  Família tipográfica Montserrat e suas aplicações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {typography.map((type, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-slate-900">{type.name}</span>
                            <Badge variant="outline" className="text-xs">{type.weight}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{type.usage}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                            <span>Tamanho: {type.size}</span>
                            <span>Line-height: {type.lineHeight}</span>
                          </div>
                        </div>
                        <div className="lg:text-right">
                          <span
                            style={{
                              fontFamily: 'var(--font-montserrat)',
                              fontSize: type.size.split(' / ')[0],
                              fontWeight: type.weight,
                              lineHeight: type.lineHeight,
                            }}
                            className="text-slate-900"
                          >
                            {type.example}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Download da Fonte</CardTitle>
                <CardDescription>
                  Baixe a fonte Montserrat para uso local
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <a href="https://fonts.google.com/specimen/Montserrat" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Google Fonts
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logo Tab */}
          <TabsContent value="logo" className="space-y-6">
            {/* Correct Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Uso Correto
                </CardTitle>
                <CardDescription>
                  Aplicações corretas da logo NESS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {logoRules.correct.map((rule, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden bg-white">
                      <div className="p-4 bg-slate-50">
                        {rule.preview}
                      </div>
                      <div className="p-4">
                        <p className="font-medium text-slate-900 mb-1">{rule.title}</p>
                        <p className="text-sm text-slate-600">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Incorrect Usage */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <X className="h-5 w-5" />
                  Uso Incorreto
                </CardTitle>
                <CardDescription className="text-red-600">
                  Nunca utilize a logo desta forma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {logoRules.incorrect.map((rule, index) => (
                    <div key={index} className="border border-red-200 rounded-lg overflow-hidden bg-white">
                      <div className="p-4 bg-slate-50 relative">
                        <div className="absolute top-2 right-2">
                          <X className="h-5 w-5 text-red-500" />
                        </div>
                        {rule.preview}
                      </div>
                      <div className="p-4">
                        <p className="font-medium text-slate-900 mb-1">{rule.title}</p>
                        <p className="text-sm text-slate-600">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Logo Downloads */}
            <Card>
              <CardHeader>
                <CardTitle>Downloads</CardTitle>
                <CardDescription>
                  Baixe os arquivos da logo em diferentes formatos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-white text-center">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                    <p className="font-medium text-slate-900 mb-1">PNG</p>
                    <p className="text-xs text-slate-500 mb-3">Fundo transparente</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg bg-white text-center">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                    <p className="font-medium text-slate-900 mb-1">SVG</p>
                    <p className="text-xs text-slate-500 mb-3">Vetorial escalável</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg bg-white text-center">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                    <p className="font-medium text-slate-900 mb-1">EPS</p>
                    <p className="text-xs text-slate-500 mb-3">Para impressão</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="espacamento" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-[#00ade8]" />
                  Escala de Espaçamento
                </CardTitle>
                <CardDescription>
                  Use estes valores para manter consistência no layout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {spacingScale.map((space, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg bg-white">
                      <div className="w-12 text-center">
                        <span className="font-mono text-sm text-slate-900">{space.name}</span>
                      </div>
                      <div className="flex-1">
                        <div
                          className="h-4 bg-[#00ade8] rounded"
                          style={{ width: space.pixels }}
                        />
                      </div>
                      <div className="w-24 text-right">
                        <span className="font-mono text-xs text-slate-500">{space.value}</span>
                      </div>
                      <div className="w-16 text-right">
                        <span className="font-mono text-xs text-slate-400">{space.pixels}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
