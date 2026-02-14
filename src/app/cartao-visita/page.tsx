'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { departmentList, rolesByDepartment } from '@/lib/organization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Download,
  QrCode,
  Mail,
  Phone,
  Linkedin,
  MessageCircle,
  Monitor,
  Smartphone,
  Loader2,
  Copy,
  Share2,
  RotateCw,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';

// Card templates
const cardTemplates = [
  { id: 'classic', name: 'Classic', description: 'Traditional layout' },
  { id: 'modern', name: 'Modern', description: 'Clean and minimal' },
  { id: 'corporate', name: 'Corporate', description: 'Professional style' },
];

export default function CartaoVisitaPage() {
  const { user, userProfile, loading: authLoading, isDemoMode } = useAuth();
  const router = useRouter();
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    linkedin: '',
    whatsapp: '',
    template: 'classic',
  });

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showBack, setShowBack] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user && !isDemoMode) {
      router.push('/');
    }
  }, [user, authLoading, router, isDemoMode]);

  // Pre-fill form with user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        firstName: userProfile.firstName || prev.firstName,
        lastName: userProfile.lastName || prev.lastName,
        email: userProfile.email || prev.email,
        phone: userProfile.phone || prev.phone,
        linkedin: userProfile.linkedin || prev.linkedin,
        whatsapp: userProfile.whatsapp || prev.whatsapp,
        department: userProfile.area || prev.department,
        role: userProfile.role || prev.role,
      }));
    }
  }, [userProfile]);

  // Generate QR Code
  useEffect(() => {
    generateQRCode();
  }, [formData]);

  const generateQRCode = async () => {
    if (!formData.firstName || !formData.email) {
      setQrCodeUrl('');
      return;
    }

    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${formData.lastName};${formData.firstName}
FN:${formData.firstName} ${formData.lastName}
ORG:NESS
TITLE:${formData.role}
EMAIL:${formData.email}
TEL:${formData.phone}
URL:https://www.ness.com.br
END:VCARD`;

    try {
      const url = await QRCode.toDataURL(vcard, {
        width: 150,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
      setQrCodeUrl(url);
    } catch {
      setQrCodeUrl('');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const downloadCard = async (side: 'front' | 'back') => {
    const ref = side === 'front' ? frontCardRef : backCardRef;
    if (!ref.current) return;

    setLoading(true);
    try {
      const dataUrl = await toPng(ref.current, { pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `business-card-${formData.firstName.toLowerCase()}-${side}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: `Card ${side} downloaded!` });
    } catch {
      toast({ title: 'Error generating image', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const downloadBoth = async () => {
    await downloadCard('front');
    await new Promise(r => setTimeout(r, 500));
    await downloadCard('back');
  };

  const copyShareLink = () => {
    // In production, this would be a real shareable link
    const link = `https://mkt.ness.com.br/card/${user?.uid || 'demo'}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Link copied!' });
  };

  // Card dimensions: 3.5 x 2 inches = 350 x 200 px at 100 DPI
  const cardWidth = 350;
  const cardHeight = 200;

  const renderCardFront = () => {
    const isDark = formData.template === 'corporate';
    const bgColor = isDark ? '#0f172a' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0f172a';
    const mutedColor = isDark ? 'rgba(255,255,255,0.7)' : '#64748b';

    return (
      <div
        ref={frontCardRef}
        style={{
          width: cardWidth,
          height: cardHeight,
          backgroundColor: bgColor,
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'Montserrat, Arial, sans-serif',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: textColor }}>
              ness<span style={{ color: '#00ade8' }}>.</span>
            </div>
            {formData.department && (
              <div style={{ fontSize: '10px', color: mutedColor, marginTop: '2px' }}>
                {formData.department}
              </div>
            )}
          </div>
          {formData.template === 'modern' && (
            <div style={{ width: '40px', height: '4px', backgroundColor: '#00ade8', borderRadius: '2px' }} />
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: textColor }}>
            {formData.firstName} {formData.lastName}
          </div>
          {formData.role && (
            <div style={{ fontSize: '12px', color: '#00ade8', marginTop: '4px' }}>
              {formData.role}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px', color: mutedColor }}>
          {formData.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✉</span>
              <span>{formData.email}</span>
            </div>
          )}
          {formData.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📱</span>
              <span>{formData.phone}</span>
            </div>
          )}
        </div>

        {/* Accent for corporate */}
        {formData.template === 'corporate' && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: '#00ade8',
            borderRadius: '0 0 12px 12px',
          }} />
        )}
      </div>
    );
  };

  const renderCardBack = () => {
    const isDark = formData.template === 'corporate';
    const bgColor = isDark ? '#0f172a' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0f172a';

    return (
      <div
        ref={backCardRef}
        style={{
          width: cardWidth,
          height: cardHeight,
          backgroundColor: bgColor,
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'Montserrat, Arial, sans-serif',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
      >
        {/* QR Code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {qrCodeUrl && (
            <img src={qrCodeUrl} alt="QR Code" style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
          )}
          <div style={{ fontSize: '8px', color: '#64748b', marginTop: '8px' }}>Scan for contact</div>
        </div>

        {/* Info */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
            ness<span style={{ color: '#00ade8' }}>.</span>
          </div>
          <div style={{ fontSize: '12px', color: '#00ade8', marginBottom: '4px' }}>www.ness.com.br</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Cybersecurity Solutions</div>
        </div>

        {/* Accent */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: '#00ade8',
          borderRadius: '0 0 12px 12px',
        }} />
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
                <h1 className="text-xl font-bold text-slate-900">Business Cards</h1>
                <p className="text-xs text-slate-500">Digital card generator</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyShareLink}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Form */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Information</CardTitle>
                <CardDescription>Fill in your details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={formData.department} onValueChange={(v) => handleInputChange('department', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentList.map((dept) => (
                          <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={formData.role} onValueChange={(v) => handleInputChange('role', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {(rolesByDepartment[formData.department] || []).map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@ness.com.br"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+55 11 99999-9999"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/john"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {cardTemplates.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        formData.template === t.id
                          ? 'border-[#00ade8] bg-[#00ade8]/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleInputChange('template', t.id)}
                    >
                      <div className="text-sm font-medium">{t.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBack(!showBack)}
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      {showBack ? 'Front' : 'Back'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-slate-100 rounded-xl p-6" style={{ minWidth: cardWidth + 40 }}>
                    {showBack ? (
                      <div style={{ position: 'relative' }}>{renderCardBack()}</div>
                    ) : (
                      <div style={{ position: 'relative' }}>{renderCardFront()}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => downloadCard('front')} disabled={loading} className="flex-1 sm:flex-none">
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    Front
                  </Button>
                  <Button variant="outline" onClick={() => downloadCard('back')} disabled={loading} className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button variant="outline" onClick={downloadBoth} disabled={loading} className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    Both
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
