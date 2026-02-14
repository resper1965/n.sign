'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  FileText,
  Copy,
  Eye,
  Download,
  Shield,
  Settings,
  Users,
  GraduationCap,
  FilePlus,
  Building,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  Loader2,
  Monitor,
  Tablet,
  AlertTriangle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Template definitions
const templates = [
  {
    id: 'pentest',
    name: 'Security Assessment',
    title: 'Proposta de Pentest',
    description: 'Testes de intrusão e avaliação de segurança',
    icon: Shield,
    color: '#ef4444',
    defaultServices: [
      'Análise de vulnerabilidades',
      'Testes de penetração externos',
      'Testes de penetração internos',
      'Relatório técnico executivo',
      'Apresentação de resultados',
    ],
    defaultTimeline: '4-6 semanas',
    defaultScope: `Esta proposta contempla a realização de testes de intrusão (Pentest) nos sistemas e infraestrutura indicados, seguindo metodologias reconhecidas como OWASP, PTES e NIST.

Os testes serão realizados por profissionais certificados (OSCP, CEH, OSCP) com ampla experiência em testes de segurança ofensiva.`,
    defaultTerms: `• Validade da proposta: 30 dias
• Pagamento: 50% no início, 50% na entrega
• Confidencialidade total garantida
• Relatórios entregues em até 5 dias úteis após os testes
• Reunião de apresentação dos resultados incluída`,
  },
  {
    id: 'managed',
    name: 'Managed Services',
    title: 'Proposta de SOC/MDR',
    description: 'Serviços gerenciados de monitoramento e resposta',
    icon: Settings,
    color: '#00ade8',
    defaultServices: [
      'Monitoramento 24x7x365',
      'Detecção de ameaças em tempo real',
      'Resposta a incidentes',
      'Threat Intelligence',
      'Relatórios mensais de segurança',
      'Suporte dedicado',
    ],
    defaultTimeline: 'Contrato mensal/anual',
    defaultScope: `Esta proposta contempla serviços gerenciados de Security Operations Center (SOC) e Managed Detection and Response (MDR).

Nossa equipe de analistas especializados monitora sua infraestrutura continuamente, detectando e respondendo a ameaças em tempo real.`,
    defaultTerms: `• Contrato mínimo: 12 meses
• Faturamento mensal antecipado
• SLA de resposta: 15 minutos para críticos
• Relatórios mensais e trimestrais
• Portal de visibilidade incluído`,
  },
  {
    id: 'consulting',
    name: 'Consulting',
    title: 'Proposta de Consultoria',
    description: 'Consultoria especializada em segurança',
    icon: Users,
    color: '#8b5cf6',
    defaultServices: [
      'Análise de maturidade de segurança',
      'Definição de estratégias de segurança',
      'Acompanhamento de projetos',
      'Revisão de políticas e processos',
      'Training e capacitação de equipes',
    ],
    defaultTimeline: 'Conforme escopo definido',
    defaultScope: `Esta proposta contempla serviços de consultoria especializada em segurança da informação.

Nossos consultores sênior atuam como extension da sua equipe, trazendo expertise em projetos complexos de segurança cibernética.`,
    defaultTerms: `• Validade da proposta: 30 dias
• Pagamento: Mensal conforme horas dedicadas
• Flexibilidade de alocação
• Relatórios de progresso semanais
• Documentação completa entregue`,
  },
  {
    id: 'training',
    name: 'Training',
    title: 'Proposta de Treinamento',
    description: 'Capacitação e conscientização em segurança',
    icon: GraduationCap,
    color: '#10b981',
    defaultServices: [
      'Treinamento de conscientização',
      'Simulação de phishing',
      'Workshops práticos',
      'Material didático personalizado',
      'Certificados de participação',
    ],
    defaultTimeline: '1-2 semanas',
    defaultScope: `Esta proposta contempla programas de treinamento e conscientização em segurança da informação.

Nossos programas são personalizados para cada organização, utilizando técnicas de gamificação e conteúdo atualizado.`,
    defaultTerms: `• Validade da proposta: 30 dias
• Pagamento: 100% antes do treinamento
• Materiais digitais incluídos
• Certificados para todos os participantes
• Suporte pós-treinamento por 30 dias`,
  },
  {
    id: 'custom',
    name: 'Custom',
    title: 'Proposta Personalizada',
    description: 'Template em branco para propostas customizadas',
    icon: FilePlus,
    color: '#64748b',
    defaultServices: [],
    defaultTimeline: '',
    defaultScope: '',
    defaultTerms: `• Validade da proposta: 30 dias
• Condições de pagamento a definir
• Confidencialidade total garantida`,
  },
];

// Form data interface
interface ProposalFormData {
  templateId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  projectName: string;
  services: string[];
  customService: string;
  scope: string;
  timeline: string;
  value: string;
  paymentTerms: string;
  deadline: string;
  terms: string;
  executiveSummary: string;
}

// Initial form data
const getInitialFormData = (templateId: string = 'pentest'): ProposalFormData => {
  const template = templates.find(t => t.id === templateId) || templates[0];
  return {
    templateId,
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    projectName: '',
    services: template.defaultServices,
    customService: '',
    scope: template.defaultScope,
    timeline: template.defaultTimeline,
    value: '',
    paymentTerms: '',
    deadline: '',
    terms: template.defaultTerms,
    executiveSummary: '',
  };
};

export default function PropostasPage() {
  const { user, loading: authLoading, isDemoMode } = useAuth();
  const router = useRouter();
  const proposalRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState<ProposalFormData>(getInitialFormData());

  // UI state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet'>('desktop');
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user && !isDemoMode) {
      router.push('/');
    }
  }, [user, authLoading, router, isDemoMode]);

  // Calculate form progress (memoized)
  const formProgress = (() => {
    const requiredFields = ['clientName', 'clientCompany', 'projectName', 'scope', 'value', 'deadline'];
    const filledFields = requiredFields.filter(field => {
      const value = formData[field as keyof ProposalFormData];
      return typeof value === 'string' && value.trim() !== '';
    });
    const hasServices = formData.services.length > 0;
    return ((filledFields.length + (hasServices ? 1 : 0)) / (requiredFields.length + 1)) * 100;
  })();

  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        templateId,
        services: template.defaultServices,
        scope: template.defaultScope,
        timeline: template.defaultTimeline,
        terms: template.defaultTerms,
      }));
    }
  };

  // Handle input change
  const handleInputChange = (field: keyof ProposalFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Toggle service
  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  // Add custom service
  const addCustomService = () => {
    if (formData.customService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, prev.customService.trim()],
        customService: '',
      }));
    }
  };

  // Remove service
  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service),
    }));
  };

  // Generate proposal text
  const generateProposalText = (): string => {
    const template = templates.find(t => t.id === formData.templateId);
    const currentDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    return `
================================================================================
                              PROPOSTA COMERCIAL
                                  ness.
================================================================================

Data: ${currentDate}

--------------------------------------------------------------------------------
                                 CLIENTE
--------------------------------------------------------------------------------

Empresa: ${formData.clientCompany || '[Nome da Empresa]'}
Contato: ${formData.clientName || '[Nome do Contato]'}
Email: ${formData.clientEmail || '[email@empresa.com]'}
Telefone: ${formData.clientPhone || '[+55 XX XXXXX-XXXX]'}

--------------------------------------------------------------------------------
                              PROJETO
--------------------------------------------------------------------------------

${formData.projectName || template?.title || 'Proposta de Serviços de Segurança'}

--------------------------------------------------------------------------------
                              RESUMO EXECUTIVO
--------------------------------------------------------------------------------

${formData.executiveSummary || `A NESS tem prazer em apresentar esta proposta de serviços de segurança da informação para ${formData.clientCompany || 'sua empresa'}. Nossa equipe de especialistas está preparada para entregar resultados que fortalecerão a postura de segurança da sua organização.`}

--------------------------------------------------------------------------------
                              ESCOPO DOS SERVIÇOS
--------------------------------------------------------------------------------

${formData.scope || 'Escopo a ser definido conforme necessidade do cliente.'}

SERVIÇOS INCLUÍDOS:
${formData.services.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

--------------------------------------------------------------------------------
                                CRONOGRAMA
--------------------------------------------------------------------------------

Prazo de execução: ${formData.timeline || 'A definir conforme escopo'}
Data limite proposta: ${formData.deadline || 'A definir'}

--------------------------------------------------------------------------------
                               INVESTIMENTO
--------------------------------------------------------------------------------

Valor total: R$ ${formData.value || '0,00'}
${formData.paymentTerms ? `Condições de pagamento: ${formData.paymentTerms}` : ''}

--------------------------------------------------------------------------------
                       TERMOS E CONDIÇÕES
--------------------------------------------------------------------------------

${formData.terms}

--------------------------------------------------------------------------------
                               CONTATO
--------------------------------------------------------------------------------

NESS - Network & Enterprise Security Solutions
Website: www.ness.com.br
Email: contato@ness.com.br
Telefone: +55 11 4000-0000

================================================================================
                    Obrigado pela oportunidade de apresentar
                         nossa proposta de serviços.
================================================================================
    `.trim();
  };

  // Copy proposal as text
  const copyAsText = async () => {
    const text = generateProposalText();
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Proposta copiada!',
        description: 'O texto foi copiado para a área de transferência.',
      });
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o texto.',
        variant: 'destructive',
      });
    }
  };

  // Generate PDF preview (simulated)
  const generatePdfPreview = async () => {
    setGeneratingPdf(true);
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setGeneratingPdf(false);
    setPreviewOpen(true);
    toast({
      title: 'Preview gerado!',
      description: 'Visualize a proposta no painel lateral.',
    });
  };

  // Render proposal preview
  const renderProposalPreview = () => {
    const template = templates.find(t => t.id === formData.templateId);
    const currentDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    return (
      <div ref={proposalRef} className="bg-white p-8 shadow-lg" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
        {/* Header */}
        <div className="border-b-2 border-[#00ade8] pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                ness<span className="text-[#00ade8]">.</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">Network & Enterprise Security Solutions</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-slate-900">PROPOSTA COMERCIAL</h2>
              <p className="text-sm text-slate-600">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <h3 className="text-sm font-semibold text-[#00ade8] uppercase mb-2">Cliente</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Empresa</p>
              <p className="font-medium text-slate-900">{formData.clientCompany || '[Nome da Empresa]'}</p>
            </div>
            <div>
              <p className="text-slate-500">Contato</p>
              <p className="font-medium text-slate-900">{formData.clientName || '[Nome do Contato]'}</p>
            </div>
            <div>
              <p className="text-slate-500">Email</p>
              <p className="font-medium text-slate-900">{formData.clientEmail || '[email@empresa.com]'}</p>
            </div>
            <div>
              <p className="text-slate-500">Telefone</p>
              <p className="font-medium text-slate-900">{formData.clientPhone || '[+55 XX XXXXX-XXXX]'}</p>
            </div>
          </div>
        </div>

        {/* Project Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#00ade8] pl-3">
            {formData.projectName || template?.title || 'Proposta de Serviços'}
          </h2>
        </div>

        {/* Executive Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#00ade8] uppercase mb-2">Resumo Executivo</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {formData.executiveSummary || `A NESS tem prazer em apresentar esta proposta de serviços de segurança da informação para ${formData.clientCompany || 'sua empresa'}. Nossa equipe de especialistas está preparada para entregar resultados que fortalecerão a postura de segurança da sua organização.`}
          </p>
        </div>

        {/* Scope of Work */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#00ade8] uppercase mb-2">Escopo dos Serviços</h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">
            {formData.scope || 'Escopo a ser definido conforme necessidade do cliente.'}
          </p>
          {formData.services.length > 0 && (
            <ul className="space-y-2">
              {formData.services.map((service, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#00ade8] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{service}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Timeline */}
        <div className="mb-6 p-4 border border-slate-200 rounded-lg">
          <h3 className="text-sm font-semibold text-[#00ade8] uppercase mb-2">Cronograma</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Prazo de execução</p>
              <p className="font-medium text-slate-900">{formData.timeline || 'A definir'}</p>
            </div>
            <div>
              <p className="text-slate-500">Data limite</p>
              <p className="font-medium text-slate-900">{formData.deadline || 'A definir'}</p>
            </div>
          </div>
        </div>

        {/* Investment */}
        <div className="mb-6 p-4 bg-[#00ade8]/5 border border-[#00ade8]/20 rounded-lg">
          <h3 className="text-sm font-semibold text-[#00ade8] uppercase mb-2">Investimento</h3>
          <div className="text-2xl font-bold text-slate-900 mb-2">
            R$ {formData.value || '0,00'}
          </div>
          {formData.paymentTerms && (
            <p className="text-sm text-slate-600">{formData.paymentTerms}</p>
          )}
        </div>

        {/* Terms */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#00ade8] uppercase mb-2">Termos e Condições</h3>
          <p className="text-sm text-slate-600 whitespace-pre-line">{formData.terms}</p>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-4 mt-auto">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-lg font-bold text-slate-900">
                ness<span className="text-[#00ade8]">.</span>
              </p>
              <p className="text-xs text-slate-500">www.ness.com.br</p>
              <p className="text-xs text-slate-500">contato@ness.com.br</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Obrigado pela oportunidade</p>
              <p>de apresentar nossa proposta.</p>
            </div>
          </div>
        </div>
      </div>
    );
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
                <h1 className="text-xl font-bold text-slate-900">Propostas</h1>
                <p className="text-xs text-slate-500">Gerador de propostas comerciais</p>
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
          {/* Left Panel - Form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Progresso da proposta</span>
                  <span className="text-sm text-slate-500">{Math.round(formProgress)}%</span>
                </div>
                <Progress value={formProgress} className="h-2" />
              </CardContent>
            </Card>

            {/* Template Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#00ade8]" />
                  Template
                </CardTitle>
                <CardDescription>Selecione o tipo de proposta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {templates.map((t) => {
                    const Icon = t.icon;
                    return (
                      <div
                        key={t.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.templateId === t.id
                            ? 'border-[#00ade8] bg-[#00ade8]/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => handleTemplateChange(t.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${t.color}15` }}
                          >
                            <Icon className="h-5 w-5" style={{ color: t.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-slate-900">{t.name}</div>
                            <div className="text-xs text-slate-500">{t.description}</div>
                          </div>
                          {formData.templateId === t.id && (
                            <CheckCircle2 className="h-5 w-5 text-[#00ade8]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-4 w-4 text-[#00ade8]" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome do Contato *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="João Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCompany">Empresa *</Label>
                    <Input
                      id="clientCompany"
                      value={formData.clientCompany}
                      onChange={(e) => handleInputChange('clientCompany', e.target.value)}
                      placeholder="Empresa ABC"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      placeholder="joao@empresa.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Telefone</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#00ade8]" />
                  Detalhes do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Nome do Projeto *</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    placeholder="Pentest Aplicação Web"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="executiveSummary">Resumo Executivo</Label>
                  <Textarea
                    id="executiveSummary"
                    value={formData.executiveSummary}
                    onChange={(e) => handleInputChange('executiveSummary', e.target.value)}
                    placeholder="Resumo executivo da proposta..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[#00ade8]" />
                  Serviços
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {formData.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#00ade8]" />
                          <span className="text-sm text-slate-700">{service}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
                          onClick={() => removeService(service)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="flex gap-2">
                  <Input
                    value={formData.customService}
                    onChange={(e) => handleInputChange('customService', e.target.value)}
                    placeholder="Adicionar serviço..."
                    onKeyPress={(e) => e.key === 'Enter' && addCustomService()}
                  />
                  <Button variant="outline" onClick={addCustomService}>
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Scope */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Escopo</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.scope}
                  onChange={(e) => handleInputChange('scope', e.target.value)}
                  placeholder="Descreva o escopo do projeto..."
                  rows={5}
                />
              </CardContent>
            </Card>

            {/* Timeline & Investment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#00ade8]" />
                  Prazo e Investimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeline">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Prazo de Execução
                    </Label>
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      placeholder="4-6 semanas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Data Limite *
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">Valor (R$) *</Label>
                    <Input
                      id="value"
                      value={formData.value}
                      onChange={(e) => handleInputChange('value', e.target.value)}
                      placeholder="50.000,00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Condições de Pagamento</Label>
                    <Input
                      id="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                      placeholder="50/30/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Termos e Condições</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  placeholder="Termos e condições da proposta..."
                  rows={5}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Preview Card */}
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4 text-[#00ade8]" />
                    Pré-visualização Rápida
                  </CardTitle>
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                      size="sm"
                      className={`h-7 ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                      onClick={() => setPreviewMode('desktop')}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                      size="sm"
                      className={`h-7 ${previewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
                      onClick={() => setPreviewMode('tablet')}
                    >
                      <Tablet className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] rounded-lg border bg-slate-50">
                  <div className="p-2">
                    {/* Mini Preview */}
                    <div className={`mx-auto transition-all duration-300 ${
                      previewMode === 'tablet' ? 'max-w-sm' : ''
                    }`}>
                      <div className="bg-white shadow-sm rounded-md overflow-hidden">
                        {/* Mini Header */}
                        <div className="border-b-2 border-[#00ade8] p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-900">
                              ness<span className="text-[#00ade8]">.</span>
                            </span>
                            <span className="text-xs font-medium text-slate-600">PROPOSTA</span>
                          </div>
                        </div>
                        
                        {/* Mini Client */}
                        <div className="p-3 bg-slate-50">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-slate-400">Empresa: </span>
                              <span className="font-medium">{formData.clientCompany || '---'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Contato: </span>
                              <span className="font-medium">{formData.clientName || '---'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Mini Project */}
                        <div className="p-3">
                          <h3 className="text-sm font-semibold text-slate-900 border-l-2 border-[#00ade8] pl-2 mb-2">
                            {formData.projectName || 'Nome do Projeto'}
                          </h3>
                          <p className="text-xs text-slate-600 line-clamp-3">
                            {formData.executiveSummary || formData.scope || 'Descrição do projeto...'}
                          </p>
                        </div>

                        {/* Mini Services */}
                        <div className="p-3 border-t border-slate-100">
                          <p className="text-xs font-medium text-[#00ade8] mb-2">SERVIÇOS</p>
                          <div className="space-y-1">
                            {formData.services.slice(0, 3).map((service, i) => (
                              <div key={i} className="flex items-center gap-1 text-xs text-slate-600">
                                <CheckCircle2 className="h-3 w-3 text-[#00ade8]" />
                                <span className="truncate">{service}</span>
                              </div>
                            ))}
                            {formData.services.length > 3 && (
                              <p className="text-xs text-slate-400">+{formData.services.length - 3} mais</p>
                            )}
                          </div>
                        </div>

                        {/* Mini Investment */}
                        <div className="p-3 bg-[#00ade8]/5 border-t border-slate-100">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600">Investimento</span>
                            <span className="text-lg font-bold text-slate-900">
                              R$ {formData.value || '0,00'}
                            </span>
                          </div>
                        </div>

                        {/* Mini Footer */}
                        <div className="p-2 border-t border-slate-100 text-center">
                          <span className="text-xs text-slate-400">
                            www.ness.com.br
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="sticky top-[580px]">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={generatePdfPreview} disabled={generatingPdf} className="flex-1 bg-[#00ade8] hover:bg-[#00ade8]/90">
                    {generatingPdf ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    Preview PDF
                  </Button>
                  <Button variant="outline" onClick={copyAsText} className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Texto
                  </Button>
                  <Button variant="outline" disabled className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                  Dica: Use "Copiar Texto" para colar no WhatsApp ou email rapidamente
                </p>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Antes de enviar</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Revise todos os campos obrigatórios e certifique-se de que o valor e prazo estão corretos.
                      A proposta pode ser editada a qualquer momento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* PDF Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview da Proposta</DialogTitle>
            <DialogDescription>Visualização completa da proposta comercial</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[85vh]">
            <div className="bg-slate-100 p-4">
              {renderProposalPreview()}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
