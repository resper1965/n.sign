'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Presentation,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Monitor,
  Building2,
  TrendingUp,
  Code,
  Rocket,
  ClipboardList,
  Grid3X3,
  LayoutGrid,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Template categories
const categories = [
  { id: 'all', name: 'Todos', icon: Grid3X3 },
  { id: 'corporate', name: 'Corporativo', icon: Building2 },
  { id: 'sales', name: 'Vendas', icon: TrendingUp },
  { id: 'technical', name: 'Técnico', icon: Code },
  { id: 'pitch', name: 'Pitch Deck', icon: Rocket },
];

// Presentation templates
const templates = [
  {
    id: 'corporate-overview',
    name: 'Corporate Overview',
    namePt: 'Visão Corporativa',
    description: 'Apresentação institucional para introdução da empresa',
    category: 'corporate',
    slides: 12,
    format: '16:9',
    thumbnail: [
      { bg: '#00ade8', title: 'NESS', subtitle: 'Apresentação Institucional' },
      { bg: '#1e293b', title: 'Quem Somos', subtitle: 'Nossa história e propósito' },
      { bg: '#f1f5f9', title: 'Nossos Valores', subtitle: 'O que nos move' },
    ],
    downloadUrl: '/templates/corporate-overview.pptx',
    googleSlidesUrl: 'https://docs.google.com/presentation/d/example-corporate',
  },
  {
    id: 'sales-deck',
    name: 'Sales Deck',
    namePt: 'Apresentação de Vendas',
    description: 'Apresentação de produtos e serviços para clientes',
    category: 'sales',
    slides: 15,
    format: '16:9',
    thumbnail: [
      { bg: '#1e293b', title: 'Soluções NESS', subtitle: 'Apresentação Comercial' },
      { bg: '#00ade8', title: 'Desafios', subtitle: 'Entendendo suas necessidades' },
      { bg: '#f1f5f9', title: 'Nossas Soluções', subtitle: 'Como podemos ajudar' },
    ],
    downloadUrl: '/templates/sales-deck.pptx',
    googleSlidesUrl: 'https://docs.google.com/presentation/d/example-sales',
  },
  {
    id: 'technical-proposal',
    name: 'Technical Proposal',
    namePt: 'Proposta Técnica',
    description: 'Detalhes técnicos para propostas e projetos',
    category: 'technical',
    slides: 18,
    format: '16:9',
    thumbnail: [
      { bg: '#0f172a', title: 'Proposta Técnica', subtitle: 'Especificação do Projeto' },
      { bg: '#00ade8', title: 'Arquitetura', subtitle: 'Visão técnica da solução' },
      { bg: '#1e293b', title: 'Cronograma', subtitle: 'Fases e entregas' },
    ],
    downloadUrl: '/templates/technical-proposal.pptx',
    googleSlidesUrl: 'https://docs.google.com/presentation/d/example-technical',
  },
  {
    id: 'pitch-deck',
    name: 'Pitch Deck',
    namePt: 'Apresentação para Investidores',
    description: 'Apresentação para investidores e stakeholders',
    category: 'pitch',
    slides: 10,
    format: '16:9',
    thumbnail: [
      { bg: '#00ade8', title: 'NESS', subtitle: 'Investor Pitch 2024' },
      { bg: '#1e293b', title: 'O Problema', subtitle: 'Oportunidade de mercado' },
      { bg: '#f1f5f9', title: 'Nossa Solução', subtitle: 'Diferencial competitivo' },
    ],
    downloadUrl: '/templates/pitch-deck.pptx',
    googleSlidesUrl: 'https://docs.google.com/presentation/d/example-pitch',
  },
  {
    id: 'project-update',
    name: 'Project Update',
    namePt: 'Atualização de Projeto',
    description: 'Relatório de status e progresso de projetos',
    category: 'corporate',
    slides: 8,
    format: '16:9',
    thumbnail: [
      { bg: '#1e293b', title: 'Status Report', subtitle: 'Atualização do Projeto' },
      { bg: '#00ade8', title: 'Progresso', subtitle: 'Marco atual' },
      { bg: '#f1f5f9', title: 'Próximos Passos', subtitle: 'Ações e entregas' },
    ],
    downloadUrl: '/templates/project-update.pptx',
    googleSlidesUrl: 'https://docs.google.com/presentation/d/example-project',
  },
];

// Category icon mapping
const categoryIcons: Record<string, React.ElementType> = {
  corporate: Building2,
  sales: TrendingUp,
  technical: Code,
  pitch: Rocket,
};

export default function ApresentacoesPage() {
  const { user, isDemoMode, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Redirect if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ade8]" />
      </div>
    );
  }

  if (!user && !isDemoMode) {
    router.push('/');
    return null;
  }

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  // Handle download
  const handleDownload = async (template: typeof templates[0]) => {
    setDownloadingId(template.id);
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Download iniciado!',
      description: `O template "${template.namePt}" está sendo baixado.`,
    });
    
    setDownloadingId(null);
    
    // In a real implementation, this would trigger an actual file download
    // window.open(template.downloadUrl, '_blank');
  };

  // Handle Google Slides
  const handleGoogleSlides = (template: typeof templates[0]) => {
    toast({
      title: 'Abrindo Google Slides',
      description: 'Uma nova aba será aberta com o template.',
    });
    // In a real implementation, this would open the Google Slides URL
    // window.open(template.googleSlidesUrl, '_blank');
  };

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
                <h1 className="text-xl font-bold text-slate-900">Apresentações</h1>
                <p className="text-xs text-slate-500">Templates para apresentações institucionais</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {templates.length} templates
              </Badge>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-7 w-7 p-0 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-7 w-7 p-0 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Categories */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? 'bg-[#00ade8] hover:bg-[#00ade8]/90' : ''}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const CategoryIcon = categoryIcons[template.category] || FileText;
              return (
                <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 hover:border-[#00ade8]/50 overflow-hidden">
                  {/* Slide Thumbnails Preview */}
                  <div className="p-4 bg-slate-50">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {template.thumbnail.map((slide, idx) => (
                        <div
                          key={idx}
                          className="flex-shrink-0 w-24 aspect-video rounded-lg shadow-sm flex flex-col items-center justify-center p-2 text-center"
                          style={{ backgroundColor: slide.bg }}
                        >
                          <span
                            className="text-[8px] font-bold line-clamp-1"
                            style={{ color: slide.bg === '#f1f5f9' ? '#1e293b' : '#ffffff' }}
                          >
                            {slide.title}
                          </span>
                          <span
                            className="text-[6px] opacity-80 line-clamp-1 mt-0.5"
                            style={{ color: slide.bg === '#f1f5f9' ? '#64748b' : '#ffffff' }}
                          >
                            {slide.subtitle}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-[#00ade8]/10">
                          <CategoryIcon className="h-4 w-4 text-[#00ade8]" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{template.namePt}</CardTitle>
                          <CardDescription className="text-xs">{template.name}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">{template.description}</p>

                    {/* Template Info */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Presentation className="h-3.5 w-3.5" />
                        <span>{template.slides} slides</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Monitor className="h-3.5 w-3.5" />
                        <span>{template.format}</span>
                      </div>
                    </div>

                    {/* Download Actions */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-[#00ade8] hover:bg-[#00ade8]/90"
                        size="sm"
                        onClick={() => handleDownload(template)}
                        disabled={downloadingId === template.id}
                      >
                        {downloadingId === template.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        PPTX
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleGoogleSlides(template)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Google Slides
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((template) => {
              const CategoryIcon = categoryIcons[template.category] || FileText;
              return (
                <Card key={template.id} className="group hover:shadow-md transition-all duration-200 hover:border-[#00ade8]/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail Strip */}
                      <div className="hidden sm:flex gap-1 flex-shrink-0">
                        {template.thumbnail.map((slide, idx) => (
                          <div
                            key={idx}
                            className="w-16 aspect-video rounded flex items-center justify-center"
                            style={{ backgroundColor: slide.bg }}
                          >
                            <span
                              className="text-[6px] font-bold"
                              style={{ color: slide.bg === '#f1f5f9' ? '#1e293b' : '#ffffff' }}
                            >
                              {slide.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CategoryIcon className="h-4 w-4 text-[#00ade8]" />
                          <h3 className="font-semibold text-slate-900">{template.namePt}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {template.slides} slides
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{template.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span>Nome: {template.name}</span>
                          <span>Formato: {template.format}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          className="bg-[#00ade8] hover:bg-[#00ade8]/90"
                          onClick={() => handleDownload(template)}
                          disabled={downloadingId === template.id}
                        >
                          {downloadingId === template.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGoogleSlides(template)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Presentation className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum template encontrado</h3>
            <p className="text-sm text-slate-500">Tente selecionar outra categoria.</p>
          </div>
        )}

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#00ade8]" />
              Dicas para Apresentações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#00ade8]/5">
                <h4 className="font-medium text-slate-900 mb-1">Identidade Visual</h4>
                <p className="text-sm text-slate-600">
                  Utilize sempre as cores e fontes oficiais da NESS. Consulte o Manual da Marca para referências.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#00ade8]/5">
                <h4 className="font-medium text-slate-900 mb-1">Conteúdo Claro</h4>
                <p className="text-sm text-slate-600">
                  Menos é mais. Use bullet points e imagens para transmitir suas ideias de forma objetiva.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#00ade8]/5">
                <h4 className="font-medium text-slate-900 mb-1">Contato</h4>
                <p className="text-sm text-slate-600">
                  Precisa de ajuda com apresentações? Entre em contato com a equipe de Marketing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-900">ness<span className="text-[#00ade8]">.</span>OS</span>
              <span className="text-slate-300">|</span>
              <span>ness.MKT v1.0</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href="https://www.ness.com.br" className="hover:text-slate-700" target="_blank" rel="noopener noreferrer">
                ness.com.br
              </a>
              <a href="mailto:resper@ness.com.br" className="hover:text-slate-700">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
