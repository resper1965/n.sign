'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Mail,
  Copy,
  Download,
  Eye,
  Code,
  Sparkles,
  Calendar,
  Tag,
  Users,
  MessageSquare,
  Loader2,
  Check,
  FileCode,
  Palette,
} from 'lucide-react';

// Email Template Type
interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  defaultContent: {
    title: string;
    subtitle: string;
    body: string;
    ctaText: string;
    ctaLink: string;
  };
}

// Pre-built Email Templates
const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Boas-vindas para novos clientes',
    icon: <Sparkles className="h-5 w-5" />,
    category: 'onboarding',
    defaultContent: {
      title: 'Bem-vindo à NESS!',
      subtitle: 'Estamos muito felizes em ter você conosco',
      body: 'Olá! Seja bem-vindo(a) à família NESS. Estamos empolgados em começar essa jornada juntos. Nossa equipe está pronta para ajudar você a alcançar seus objetivos de marketing e tecnologia.',
      ctaText: 'Conheça nossos serviços',
      ctaLink: 'https://ness.com.br/servicos',
    },
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Atualizações mensais',
    icon: <Mail className="h-5 w-5" />,
    category: 'engagement',
    defaultContent: {
      title: 'NESS Newsletter - Edição Mensal',
      subtitle: 'As últimas novidades do mundo do marketing digital',
      body: 'Mais um mês se passa e trazemos as principais tendências e atualizações do universo digital. Nesta edição: estratégias de IA no marketing, dicas de SEO avançado, e cases de sucesso inspiradores.',
      ctaText: 'Ler newsletter completa',
      ctaLink: 'https://ness.com.br/newsletter',
    },
  },
  {
    id: 'promotion',
    name: 'Promotion',
    description: 'Ofertas especiais',
    icon: <Tag className="h-5 w-5" />,
    category: 'sales',
    defaultContent: {
      title: 'Oferta Exclusiva para Você!',
      subtitle: 'Aproveite condições especiais por tempo limitado',
      body: 'Como cliente especial, preparamos uma oferta exclusiva. Por tempo limitado, você pode aproveitar descontos especiais em nossos serviços de consultoria e implementação de marketing digital.',
      ctaText: 'Ver oferta',
      ctaLink: 'https://ness.com.br/promocoes',
    },
  },
  {
    id: 'event',
    name: 'Event Invitation',
    description: 'Webinars e eventos',
    icon: <Calendar className="h-5 w-5" />,
    category: 'events',
    defaultContent: {
      title: 'Convite: Webinar NESS',
      subtitle: 'Junte-se a nós para um evento exclusivo',
      body: 'Você está convidado(a) para nosso próximo webinar! Vamos discutir as tendências mais importantes do marketing digital em 2024 e como aplicá-las no seu negócio. Inscrições gratuitas e vagas limitadas.',
      ctaText: 'Inscrever-se agora',
      ctaLink: 'https://ness.com.br/eventos',
    },
  },
  {
    id: 'followup',
    name: 'Follow-up',
    description: 'Pós-reunião',
    icon: <MessageSquare className="h-5 w-5" />,
    category: 'relationship',
    defaultContent: {
      title: 'Obrigado pela conversa!',
      subtitle: 'Segue o resumo do nosso encontro',
      body: 'Foi um prazer conversar com você! Como combinado, estou enviando o resumo dos próximos passos e materiais complementares. Qualquer dúvida, estou à disposição.',
      ctaText: 'Agendar próxima reunião',
      ctaLink: 'https://ness.com.br/agendar',
    },
  },
];

// Generate HTML Email Template
function generateEmailHTML(content: { title: string; subtitle: string; body: string; ctaText: string; ctaLink: string }): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Montserrat', Arial, sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
      line-height: 1.6;
    }
    
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .email-container {
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #00ade8 0%, #0090c5 100%);
      padding: 40px 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 20px;
    }
    
    .logo-dot {
      color: #ffffff;
    }
    
    .title {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
    }
    
    .subtitle {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.9);
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .body-text {
      font-size: 16px;
      color: #475569;
      margin-bottom: 30px;
      line-height: 1.7;
    }
    
    .cta-button {
      display: inline-block;
      background-color: #00ade8;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    
    .cta-button:hover {
      background-color: #0090c5;
    }
    
    .footer {
      background-color: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    
    .footer-logo {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 10px;
    }
    
    .footer-text {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 15px;
    }
    
    .social-links {
      margin-top: 15px;
    }
    
    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: #475569;
      text-decoration: none;
      font-size: 12px;
    }
    
    .social-links a:hover {
      color: #00ade8;
    }
    
    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <div class="logo">ness<span class="logo-dot">.</span></div>
        <h1 class="title">${content.title}</h1>
        <p class="subtitle">${content.subtitle}</p>
      </div>
      
      <!-- Content -->
      <div class="content">
        <p class="body-text">${content.body}</p>
        <a href="${content.ctaLink}" class="cta-button">${content.ctaText}</a>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="footer-logo">ness<span style="color: #00ade8;">.</span></div>
        <p class="footer-text">Transformando negócios através do marketing digital</p>
        <div class="divider"></div>
        <div class="social-links">
          <a href="https://ness.com.br">Website</a>
          <a href="https://linkedin.com/company/nessbr">LinkedIn</a>
          <a href="https://instagram.com/nessbr">Instagram</a>
        </div>
        <p class="footer-text" style="margin-top: 15px; margin-bottom: 0;">
          © ${new Date().getFullYear()} NESS. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export default function TemplatesEmailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [templateContent, setTemplateContent] = useState({
    title: '',
    subtitle: '',
    body: '',
    ctaText: '',
    ctaLink: '',
  });
  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Select template
  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setTemplateContent(template.defaultContent);
    setActiveTab('preview');
  };

  // Copy HTML to clipboard
  const handleCopyHTML = async () => {
    const html = generateEmailHTML(templateContent);
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export as HTML file
  const handleExportHTML = () => {
    const html = generateEmailHTML(templateContent);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.id || 'email-template'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      onboarding: 'bg-green-100 text-green-700 border-green-200',
      engagement: 'bg-blue-100 text-blue-700 border-blue-200',
      sales: 'bg-orange-100 text-orange-700 border-orange-200',
      events: 'bg-purple-100 text-purple-700 border-purple-200',
      relationship: 'bg-pink-100 text-pink-700 border-pink-200',
    };
    return colors[category] || 'bg-slate-100 text-slate-700 border-slate-200';
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
                <h1 className="text-xl font-bold text-slate-900">Templates de Email</h1>
                <p className="text-xs text-slate-500">Módulo de templates para email marketing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-[#00ade8]/10 text-[#00ade8] border-[#00ade8]/20">
                ness.MKT
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Template List */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#00ade8]" />
                  Templates Disponíveis
                </CardTitle>
                <CardDescription>
                  Selecione um template para personalizar
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="p-4 space-y-3">
                    {emailTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className={`w-full text-left p-4 rounded-lg border transition-all hover:border-[#00ade8]/50 ${
                          selectedTemplate?.id === template.id
                            ? 'border-[#00ade8] bg-[#00ade8]/5'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedTemplate?.id === template.id
                              ? 'bg-[#00ade8] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {template.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-slate-900 truncate">
                                {template.name}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">
                              {template.description}
                            </p>
                            <Badge
                              variant="outline"
                              className={`mt-2 text-xs ${getCategoryColor(template.category)}`}
                            >
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Editor & Preview */}
          <div className="lg:col-span-8">
            {selectedTemplate ? (
              <div className="space-y-6">
                {/* Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-[#00ade8]" />
                      Personalizar Template
                    </CardTitle>
                    <CardDescription>
                      Edite os campos do email
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={templateContent.title}
                          onChange={(e) =>
                            setTemplateContent({ ...templateContent, title: e.target.value })
                          }
                          placeholder="Título do email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtítulo</Label>
                        <Input
                          id="subtitle"
                          value={templateContent.subtitle}
                          onChange={(e) =>
                            setTemplateContent({ ...templateContent, subtitle: e.target.value })
                          }
                          placeholder="Subtítulo do email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="body">Corpo do Email</Label>
                      <Textarea
                        id="body"
                        value={templateContent.body}
                        onChange={(e) =>
                          setTemplateContent({ ...templateContent, body: e.target.value })
                        }
                        placeholder="Conteúdo principal do email"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ctaText">Texto do Botão CTA</Label>
                        <Input
                          id="ctaText"
                          value={templateContent.ctaText}
                          onChange={(e) =>
                            setTemplateContent({ ...templateContent, ctaText: e.target.value })
                          }
                          placeholder="Texto do botão"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ctaLink">Link do Botão CTA</Label>
                        <Input
                          id="ctaLink"
                          type="url"
                          value={templateContent.ctaLink}
                          onChange={(e) =>
                            setTemplateContent({ ...templateContent, ctaLink: e.target.value })
                          }
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button onClick={handleCopyHTML} variant="outline">
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar HTML
                          </>
                        )}
                      </Button>
                      <Button onClick={handleExportHTML} className="bg-[#00ade8] hover:bg-[#0090c5]">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar HTML
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-[#00ade8]" />
                          Preview do Email
                        </CardTitle>
                        <CardDescription>
                          Visualize como o email será exibido
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setPreviewMode('desktop')}
                          className={previewMode === 'desktop' ? 'bg-[#00ade8] hover:bg-[#0090c5]' : ''}
                        >
                          Desktop
                        </Button>
                        <Button
                          variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setPreviewMode('mobile')}
                          className={previewMode === 'mobile' ? 'bg-[#00ade8] hover:bg-[#0090c5]' : ''}
                        >
                          Mobile
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="mb-4">
                        <TabsTrigger value="preview" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Visual
                        </TabsTrigger>
                        <TabsTrigger value="code" className="gap-2">
                          <Code className="h-4 w-4" />
                          HTML
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="preview">
                        <div className="flex justify-center">
                          <div
                            className={`bg-slate-100 rounded-lg p-4 overflow-auto ${
                              previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[600px] w-full'
                            }`}
                          >
                            {/* Email Preview */}
                            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                              {/* Header */}
                              <div
                                className="p-8 text-center"
                                style={{
                                  background: 'linear-gradient(135deg, #00ade8 0%, #0090c5 100%)',
                                }}
                              >
                                <div className="text-3xl font-bold text-white mb-4">
                                  ness<span className="text-white">.</span>
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">
                                  {templateContent.title || 'Título do Email'}
                                </h1>
                                <p className="text-white/90">
                                  {templateContent.subtitle || 'Subtítulo do Email'}
                                </p>
                              </div>

                              {/* Content */}
                              <div className="p-8 text-center">
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                  {templateContent.body || 'Conteúdo do email será exibido aqui...'}
                                </p>
                                <a
                                  href={templateContent.ctaLink || '#'}
                                  className="inline-block bg-[#00ade8] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0090c5] transition-colors"
                                >
                                  {templateContent.ctaText || 'Botão CTA'}
                                </a>
                              </div>

                              {/* Footer */}
                              <div className="bg-slate-50 p-6 text-center border-t">
                                <div className="text-xl font-bold text-slate-900 mb-2">
                                  ness<span className="text-[#00ade8]">.</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">
                                  Transformando negócios através do marketing digital
                                </p>
                                <div className="w-full h-px bg-slate-200 my-3" />
                                <div className="flex justify-center gap-4 text-xs text-slate-600">
                                  <span>Website</span>
                                  <span>LinkedIn</span>
                                  <span>Instagram</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-3">
                                  © {new Date().getFullYear()} NESS. Todos os direitos reservados.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="code">
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleCopyHTML}
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                              </>
                            )}
                          </Button>
                          <ScrollArea className="h-[400px]">
                            <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
                              <code>{generateEmailHTML(templateContent)}</code>
                            </pre>
                          </ScrollArea>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-[calc(100vh-200px)] flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="p-4 rounded-full bg-slate-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Selecione um Template
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Escolha um dos templates disponíveis na lista ao lado para começar a personalizar seu email.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
