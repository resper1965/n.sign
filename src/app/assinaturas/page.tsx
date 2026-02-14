'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Signature, getUserSignatures, createSignature, updateSignature, deleteSignature } from '@/services/firestore';
import { departments, rolesByDepartment, departmentList } from '@/lib/organization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Copy,
  Download,
  Eye,
  Mail,
  Phone,
  Linkedin,
  MessageCircle,
  Save,
  Trash2,
  Loader2,
  Monitor,
  Smartphone,
  History,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { toPng, toJpeg } from 'html-to-image';
import QRCode from 'qrcode';

// Template definitions
const templates = [
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Layout tradicional com logo grande',
    preview: `
      <div class="p-3 bg-white rounded border">
        <div class="flex items-start gap-3">
          <div class="w-14 h-14 bg-slate-100 rounded flex items-center justify-center text-xl font-bold">n.</div>
          <div class="text-xs">
            <div class="font-bold">Nome Sobrenome</div>
            <div class="text-slate-500">Cargo</div>
            <div class="mt-1 text-slate-600">📧 📞 🌐</div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Design minimalista e elegante',
    preview: `
      <div class="p-3 bg-white rounded border">
        <div class="border-l-4 border-[#00ade8] pl-3">
          <div class="font-bold text-sm">Nome Sobrenome</div>
          <div class="text-xs text-slate-500">Cargo • Área</div>
          <div class="text-xs text-[#00ade8] mt-1">ness.</div>
        </div>
      </div>
    `,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Apenas o essencial',
    preview: `
      <div class="p-3 bg-white rounded border">
        <div class="text-center">
          <div class="font-bold text-sm">Nome Sobrenome</div>
          <div class="text-xs text-slate-500">Cargo</div>
          <div class="text-xs text-[#00ade8] mt-1">ness.</div>
        </div>
      </div>
    `,
  },
  {
    id: 'corporate',
    name: 'Corporativo',
    description: 'Layout formal e completo',
    preview: `
      <div class="p-3 bg-white rounded border">
        <div class="flex gap-3">
          <div class="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-sm">n.</div>
          <div class="text-xs flex-1">
            <div class="font-bold">Nome Sobrenome</div>
            <div class="text-[#00ade8]">Cargo</div>
            <div class="mt-1 space-y-0.5 text-slate-600">
              <div>📧 email</div>
              <div>📞 telefone</div>
            </div>
          </div>
        </div>
      </div>
    `,
  },
];

const themes = [
  { id: 'branco', name: 'Branco', bg: 'bg-white', text: 'text-slate-900' },
  { id: 'azul', name: 'Azul NESS', bg: 'bg-[#00ade8]', text: 'text-white' },
  { id: 'dark', name: 'Dark', bg: 'bg-slate-900', text: 'text-white' },
];

export default function AssinaturasPage() {
  const { user, userProfile, loading: authLoading, isDemoMode, isConfigured } = useAuth();
  const router = useRouter();
  const signatureRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    area: '',
    cargo: '',
    email: '',
    telefone: '',
    linkedin: '',
    whatsapp: '',
    template: 'classic' as 'classic' | 'modern' | 'minimal' | 'corporate',
    theme: 'branco' as 'branco' | 'azul' | 'dark',
  });
  
  // UI state
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [formProgress, setFormProgress] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user && !isDemoMode) {
      router.push('/');
    }
  }, [user, authLoading, router, isDemoMode]);

  // Load user's signatures
  useEffect(() => {
    if (user && isConfigured) {
      loadSignatures();
    }
  }, [user, isConfigured]);

  // Pre-fill form with user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        nome: userProfile.firstName || prev.nome,
        sobrenome: userProfile.lastName || prev.sobrenome,
        email: userProfile.email || prev.email,
        telefone: userProfile.phone || prev.telefone,
        linkedin: userProfile.linkedin || prev.linkedin,
        whatsapp: userProfile.whatsapp || prev.whatsapp,
        area: userProfile.area || prev.area,
        cargo: userProfile.role || prev.cargo,
      }));
    }
  }, [userProfile]);

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ['nome', 'sobrenome', 'area', 'cargo', 'email', 'telefone'];
    const filledFields = requiredFields.filter(field => formData[field as keyof typeof formData]);
    const progress = (filledFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

  // Generate QR Code
  useEffect(() => {
    if (formData.nome && formData.email) {
      generateQRCode();
    }
  }, [formData]);

  const loadSignatures = async () => {
    if (!user || !isConfigured) return;
    setLoading(true);
    try {
      const data = await getUserSignatures(user.uid);
      setSignatures(data);
    } catch (error) {
      console.error('Error loading signatures:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as assinaturas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${formData.sobrenome};${formData.nome}
FN:${formData.nome} ${formData.sobrenome}
ORG:NESS
TITLE:${formData.cargo}
EMAIL:${formData.email}
TEL:${formData.telefone}
URL:https://www.ness.com.br
END:VCARD`;

    try {
      const url = await QRCode.toDataURL(vcard, {
        width: 80,
        margin: 1,
        color: {
          dark: formData.theme === 'azul' ? '#ffffff' : '#1e293b',
          light: formData.theme === 'azul' ? '#00ade8' : '#ffffff',
        },
      });
      setQrCodeUrl(url);
    } catch {
      setQrCodeUrl('');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Demo mode: show info message
    if (isDemoMode) {
      toast({
        title: 'Modo Demo',
        description: 'As assinaturas não são salvas no modo demo. Configure o Firebase para persistência.',
      });
      return;
    }
    
    if (!user) return;
    
    setSaving(true);
    try {
      if (selectedSignature?.id) {
        await updateSignature(selectedSignature.id, formData);
        toast({
          title: 'Assinatura atualizada!',
          description: 'As alterações foram salvas.',
        });
      } else {
        const newSignature = await createSignature({
          ...formData,
          userId: user.uid,
        });
        setSignatures(prev => [newSignature, ...prev]);
        setSelectedSignature(newSignature);
        toast({
          title: 'Assinatura criada!',
          description: 'Sua nova assinatura foi salva.',
        });
      }
      await loadSignatures();
    } catch (error) {
      console.error('Error saving signature:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isDemoMode) {
      toast({
        title: 'Modo Demo',
        description: 'Não é possível excluir assinaturas no modo demo.',
      });
      return;
    }
    
    if (!confirm('Tem certeza que deseja excluir esta assinatura?')) return;
    
    try {
      await deleteSignature(id);
      setSignatures(prev => prev.filter(s => s.id !== id));
      if (selectedSignature?.id === id) {
        setSelectedSignature(null);
        resetForm();
      }
      toast({
        title: 'Assinatura excluída',
        description: 'A assinatura foi removida.',
      });
    } catch (error) {
      console.error('Error deleting signature:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: userProfile?.firstName || '',
      sobrenome: userProfile?.lastName || '',
      area: userProfile?.area || '',
      cargo: userProfile?.role || '',
      email: userProfile?.email || '',
      telefone: userProfile?.phone || '',
      linkedin: userProfile?.linkedin || '',
      whatsapp: userProfile?.whatsapp || '',
      template: 'classic',
      theme: 'branco',
    });
    setSelectedSignature(null);
  };

  const loadSignature = (signature: Signature) => {
    setSelectedSignature(signature);
    setFormData({
      nome: signature.nome,
      sobrenome: signature.sobrenome,
      area: signature.area,
      cargo: signature.cargo,
      email: signature.email,
      telefone: signature.telefone,
      linkedin: signature.linkedin || '',
      whatsapp: signature.whatsapp || '',
      template: signature.template,
      theme: signature.theme,
    });
  };

  const copyHtmlToClipboard = async () => {
    if (!signatureRef.current) return;
    
    const html = signatureRef.current.innerHTML;
    try {
      await navigator.clipboard.writeText(html);
      toast({
        title: 'HTML copiado!',
        description: 'Cole no seu cliente de email.',
      });
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const downloadAsImage = async (format: 'png' | 'jpeg') => {
    if (!signatureRef.current) return;
    
    try {
      const dataUrl = format === 'png'
        ? await toPng(signatureRef.current, { pixelRatio: 2 })
        : await toJpeg(signatureRef.current, { pixelRatio: 2, quality: 0.95 });
      
      const link = document.createElement('a');
      link.download = `assinatura-${formData.nome.toLowerCase()}.${format}`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: `Imagem ${format.toUpperCase()} baixada!`,
        description: 'Use em plataformas que suportam imagens.',
      });
    } catch {
      toast({
        title: 'Erro ao gerar imagem',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Render signature based on template
  const renderSignature = () => {
    const { nome, sobrenome, area, cargo, email, telefone, linkedin, whatsapp, template, theme: selectedTheme } = formData;
    const themeStyle = themes.find(t => t.id === selectedTheme);
    const isDark = selectedTheme === 'dark' || selectedTheme === 'azul';
    const textColor = isDark ? '#ffffff' : '#1e293b';
    const mutedColor = isDark ? 'rgba(255,255,255,0.7)' : '#64748b';
    const accentColor = '#00ade8';

    const renderContactInfo = () => (
      <>
        {email && (
          <tr>
            <td style={{ padding: '4px 0' }}>
              <table cellPadding="0" cellSpacing="0" style={{ display: 'inline-block' }}>
                <tr>
                  <td style={{ width: '20px', verticalAlign: 'middle' }}>
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2300ade8' stroke-width='2'%3E%3Cpath d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/%3E%3Cpolyline points='22,6 12,13 2,6'/%3E%3C/svg%3E" alt="" width="16" height="16" style={{ display: 'block' }} />
                  </td>
                  <td style={{ paddingLeft: '6px', verticalAlign: 'middle' }}>
                    <a href={`mailto:${email}`} style={{ color: textColor, textDecoration: 'none', fontSize: '13px' }}>{email}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        )}
        {telefone && (
          <tr>
            <td style={{ padding: '4px 0' }}>
              <table cellPadding="0" cellSpacing="0" style={{ display: 'inline-block' }}>
                <tr>
                  <td style={{ width: '20px', verticalAlign: 'middle' }}>
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2300ade8' stroke-width='2'%3E%3Cpath d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'/%3E%3C/svg%3E" alt="" width="16" height="16" style={{ display: 'block' }} />
                  </td>
                  <td style={{ paddingLeft: '6px', verticalAlign: 'middle' }}>
                    <a href={`tel:${telefone}`} style={{ color: textColor, textDecoration: 'none', fontSize: '13px' }}>{telefone}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        )}
        <tr>
          <td style={{ padding: '4px 0' }}>
            <table cellPadding="0" cellSpacing="0" style={{ display: 'inline-block' }}>
              <tr>
                <td style={{ width: '20px', verticalAlign: 'middle' }}>
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2300ade8' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E" alt="" width="16" height="16" style={{ display: 'block' }} />
                </td>
                <td style={{ paddingLeft: '6px', verticalAlign: 'middle' }}>
                  <a href="https://www.ness.com.br" style={{ color: accentColor, textDecoration: 'none', fontSize: '13px' }}>www.ness.com.br</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </>
    );

    const renderLogo = () => (
      <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: '24px', color: isDark ? '#ffffff' : '#1e293b' }}>
        ness<span style={{ color: accentColor }}>.</span>
      </span>
    );

    switch (template) {
      case 'modern':
        return (
          <table cellPadding="0" cellSpacing="0" style={{ fontFamily: 'Arial, sans-serif' }}>
            <tr>
              <td style={{ padding: '16px', backgroundColor: themeStyle?.bg === 'bg-white' ? '#ffffff' : selectedTheme === 'azul' ? '#00ade8' : '#1e293b', borderRadius: '8px' }}>
                <table cellPadding="0" cellSpacing="0">
                  <tr>
                    <td style={{ borderLeft: `4px solid ${accentColor}`, paddingLeft: '12px' }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tr>
                          <td style={{ fontSize: '18px', fontWeight: 600, color: textColor }}>
                            {nome} {sobrenome}
                          </td>
                        </tr>
                        {cargo && (
                          <tr>
                            <td style={{ fontSize: '14px', color: mutedColor, paddingTop: '2px' }}>
                              {cargo}{area ? ` • ${area}` : ''}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ paddingTop: '12px' }}>
                            <table cellPadding="0" cellSpacing="0">
                              {renderContactInfo()}
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingTop: '16px' }}>
                            {renderLogo()}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        );

      case 'minimal':
        return (
          <table cellPadding="0" cellSpacing="0" style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            <tr>
              <td style={{ padding: '16px', backgroundColor: themeStyle?.bg === 'bg-white' ? '#ffffff' : selectedTheme === 'azul' ? '#00ade8' : '#1e293b', borderRadius: '8px' }}>
                <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                  <tr>
                    <td align="center" style={{ fontSize: '18px', fontWeight: 600, color: textColor }}>
                      {nome} {sobrenome}
                    </td>
                  </tr>
                  {cargo && (
                    <tr>
                      <td align="center" style={{ fontSize: '14px', color: mutedColor, paddingTop: '4px' }}>
                        {cargo}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td align="center" style={{ paddingTop: '12px' }}>
                      <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
                        {renderContactInfo()}
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style={{ paddingTop: '12px' }}>
                      {renderLogo()}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        );

      case 'corporate':
        return (
          <table cellPadding="0" cellSpacing="0" style={{ fontFamily: 'Arial, sans-serif' }}>
            <tr>
              <td style={{ padding: '16px', backgroundColor: themeStyle?.bg === 'bg-white' ? '#ffffff' : selectedTheme === 'azul' ? '#00ade8' : '#1e293b', borderRadius: '8px' }}>
                <table cellPadding="0" cellSpacing="0">
                  <tr>
                    <td style={{ paddingRight: '16px', verticalAlign: 'top' }}>
                      <div style={{ width: '56px', height: '56px', backgroundColor: isDark ? '#ffffff' : '#1e293b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: '24px', color: isDark ? '#1e293b' : '#ffffff' }}>n.</span>
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tr>
                          <td style={{ fontSize: '18px', fontWeight: 600, color: textColor }}>
                            {nome} {sobrenome}
                          </td>
                        </tr>
                        {cargo && (
                          <tr>
                            <td style={{ fontSize: '14px', color: accentColor, fontWeight: 500, paddingTop: '2px' }}>
                              {cargo}
                            </td>
                          </tr>
                        )}
                        {area && (
                          <tr>
                            <td style={{ fontSize: '12px', color: mutedColor, paddingTop: '2px' }}>
                              {area} | NESS
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ paddingTop: '12px' }}>
                            <table cellPadding="0" cellSpacing="0">
                              {renderContactInfo()}
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        );

      default: // classic
        return (
          <table cellPadding="0" cellSpacing="0" style={{ fontFamily: 'Arial, sans-serif' }}>
            <tr>
              <td style={{ padding: '16px', backgroundColor: themeStyle?.bg === 'bg-white' ? '#ffffff' : selectedTheme === 'azul' ? '#00ade8' : '#1e293b', borderRadius: '8px' }}>
                <table cellPadding="0" cellSpacing="0">
                  <tr>
                    <td style={{ paddingRight: '16px', verticalAlign: 'top' }}>
                      <div style={{ width: '80px', height: '80px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: '32px', color: isDark ? '#ffffff' : '#1e293b' }}>
                          n<span style={{ color: accentColor }}>.</span>
                        </span>
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tr>
                          <td style={{ fontSize: '20px', fontWeight: 600, color: textColor }}>
                            {nome} {sobrenome}
                          </td>
                        </tr>
                        {cargo && (
                          <tr>
                            <td style={{ fontSize: '14px', color: mutedColor, paddingTop: '4px' }}>
                              {cargo}
                            </td>
                          </tr>
                        )}
                        {area && (
                          <tr>
                            <td style={{ fontSize: '12px', color: accentColor, fontWeight: 500, paddingTop: '2px' }}>
                              {area} | NESS
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ paddingTop: '12px' }}>
                            <table cellPadding="0" cellSpacing="0">
                              {renderContactInfo()}
                            </table>
                          </td>
                        </tr>
                        {qrCodeUrl && (
                          <tr>
                            <td style={{ paddingTop: '12px' }}>
                              <img src={qrCodeUrl} alt="QR Code" width="60" height="60" style={{ borderRadius: '4px' }} />
                            </td>
                          </tr>
                        )}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        );
    }
  };

  if (authLoading || loading) {
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
                <h1 className="text-xl font-bold text-slate-900">Assinaturas</h1>
                <p className="text-xs text-slate-500">Gerador de assinaturas de email</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {signatures.length} assinatura{signatures.length !== 1 ? 's' : ''}
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
                  <span className="text-sm font-medium text-slate-700">Progresso do formulário</span>
                  <span className="text-sm text-slate-500">{Math.round(formProgress)}%</span>
                </div>
                <Progress value={formProgress} className="h-2" />
              </CardContent>
            </Card>

            {/* Saved Signatures */}
            {signatures.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Assinaturas Salvas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {signatures.map((sig) => (
                        <div
                          key={sig.id}
                          className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                            selectedSignature?.id === sig.id
                              ? 'border-[#00ade8] bg-[#00ade8]/5'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          onClick={() => loadSignature(sig)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{sig.nome} {sig.sobrenome}</p>
                              <p className="text-xs text-slate-500">{sig.cargo}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-slate-400 hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(sig.id!);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedSignature ? 'Editar Assinatura' : 'Nova Assinatura'}
                </CardTitle>
                <CardDescription>
                  Preencha seus dados para gerar a assinatura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="João"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sobrenome">Sobrenome *</Label>
                    <Input
                      id="sobrenome"
                      value={formData.sobrenome}
                      onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                      placeholder="Silva"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Department *</Label>
                    <Select value={formData.area} onValueChange={(v) => handleInputChange('area', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentList.map((dept) => (
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                            <span className="text-slate-400 ml-1">({dept.namePt})</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Role *</Label>
                    <Select value={formData.cargo} onValueChange={(v) => handleInputChange('cargo', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {(rolesByDepartment[formData.area] || ['Select Role']).map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="joao@ness.com.br"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="+55 11 99999-9999"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">
                      <Linkedin className="h-3 w-3 inline mr-1" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/joao"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">
                      <MessageCircle className="h-3 w-3 inline mr-1" />
                      WhatsApp
                    </Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {templates.map((t) => (
                    <div
                      key={t.id}
                      className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.template === t.id
                          ? 'border-[#00ade8] bg-[#00ade8]/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleInputChange('template', t.id)}
                    >
                      <div className="text-center mb-2">
                        <div className="text-xs font-medium">{t.name}</div>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: t.preview }} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Theme Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {themes.map((t) => (
                    <div
                      key={t.id}
                      className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        formData.theme === t.id
                          ? 'border-[#00ade8] ring-2 ring-[#00ade8]/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleInputChange('theme', t.id)}
                    >
                      <div className={`w-8 h-8 rounded-full ${t.bg} mx-auto mb-2 flex items-center justify-center ${t.text}`}>
                        Aa
                      </div>
                      <span className="text-sm">{t.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Pré-visualização
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
                      variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                      size="sm"
                      className={`h-7 ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                      onClick={() => setPreviewMode('mobile')}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`bg-slate-50 rounded-lg p-4 flex items-center justify-center ${
                    previewMode === 'mobile' ? 'max-w-xs mx-auto' : ''
                  }`}
                  style={{ minHeight: '200px' }}
                >
                  <div ref={signatureRef}>{renderSignature()}</div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none">
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={copyHtmlToClipboard} className="flex-1 sm:flex-none">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar HTML
                  </Button>
                  <Button variant="outline" onClick={() => downloadAsImage('png')} className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    PNG
                  </Button>
                  <Button variant="outline" onClick={() => downloadAsImage('jpeg')} className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    JPEG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
