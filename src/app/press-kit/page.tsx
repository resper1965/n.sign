'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Download,
  Loader2,
  FileText,
  Image,
  Users,
  Building2,
  Mail,
  Globe,
  Calendar,
  Award,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Company facts
const companyFacts = [
  { label: 'Founded', value: '2015' },
  { label: 'Headquarters', value: 'São Paulo, Brazil' },
  { label: 'Employees', value: '100+' },
  { label: 'Clients', value: '500+' },
  { label: 'Industries', value: '15+' },
  { label: 'Certifications', value: 'ISO 27001, PCI-DSS' },
];

// Leadership team
const leadership = [
  { name: 'Executive Team', role: 'Leadership', description: 'Strategic direction and company vision' },
  { name: 'Technical Team', role: 'Engineering', description: 'Security research and development' },
  { name: 'Operations Team', role: 'Operations', description: 'SOC and incident response' },
  { name: 'Commercial Team', role: 'Sales', description: 'Client relationships and growth' },
];

// Press releases
const pressReleases = [
  {
    title: 'NESS Expands Security Operations Center',
    date: '2024-01-15',
    excerpt: 'New 24x7 SOC facility increases monitoring capacity by 200%.',
  },
  {
    title: 'NESS Achieves ISO 27001 Certification',
    date: '2023-11-20',
    excerpt: 'International recognition for information security management.',
  },
  {
    title: 'Partnership with Major Cloud Provider',
    date: '2023-09-05',
    excerpt: 'Strategic partnership to enhance cloud security services.',
  },
];

// Services
const services = [
  { name: 'Penetration Testing', description: 'Vulnerability assessment and exploitation' },
  { name: 'SOC/MDR', description: '24x7 monitoring and incident response' },
  { name: 'Security Consulting', description: 'Strategic security advisory' },
  { name: 'Security Training', description: 'Awareness and technical training' },
];

// Logo assets
const logoAssets = [
  { name: 'Logo Primary', format: 'PNG', bg: 'Transparent', size: '2.4 MB' },
  { name: 'Logo White', format: 'PNG', bg: 'Transparent', size: '2.1 MB' },
  { name: 'Logo Dark', format: 'PNG', bg: 'Transparent', size: '2.2 MB' },
  { name: 'Logo Vector', format: 'SVG', bg: 'Scalable', size: '45 KB' },
  { name: 'Logo Print', format: 'EPS', bg: 'CMYK', size: '1.8 MB' },
  { name: 'Icon Only', format: 'PNG', bg: 'Transparent', size: '890 KB' },
];

export default function PressKitPage() {
  const { user, loading: authLoading, isDemoMode } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user && !isDemoMode) {
      router.push('/');
    }
  }, [user, authLoading, router, isDemoMode]);

  const downloadAsset = (asset: { name: string; format: string }) => {
    toast({
      title: 'Download started',
      description: `${asset.name} (${asset.format})`,
    });
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
                <h1 className="text-xl font-bold text-slate-900">Press Kit</h1>
                <p className="text-xs text-slate-500">Media resources</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Updated 2024
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* About Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00ade8]/10">
                <Building2 className="h-6 w-6 text-[#00ade8]" />
              </div>
              <div>
                <CardTitle>About NESS</CardTitle>
                <CardDescription>Brazilian cybersecurity company</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed">
              NESS is a leading Brazilian cybersecurity company specialized in offensive security, 
              managed detection and response (MDR), and security consulting. With over 100 professionals 
              and 500+ clients across 15 industries, NESS helps organizations protect their digital 
              assets through comprehensive security solutions.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
              {companyFacts.map((fact, index) => (
                <div key={index} className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#00ade8]">{fact.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{fact.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="logos" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="logos" className="gap-2">
              <Image className="h-4 w-4" />
              Logo & Assets
            </TabsTrigger>
            <TabsTrigger value="releases" className="gap-2">
              <FileText className="h-4 w-4" />
              Press Releases
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Globe className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Mail className="h-4 w-4" />
              Media Contact
            </TabsTrigger>
          </TabsList>

          {/* Logo Assets Tab */}
          <TabsContent value="logos" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {logoAssets.map((asset, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <div className="text-4xl font-bold text-slate-900">
                      ness<span className="text-[#00ade8]">.</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{asset.name}</h3>
                        <p className="text-sm text-slate-500">{asset.format} • {asset.bg} • {asset.size}</p>
                      </div>
                      <Button variant="outline" size="icon" onClick={() => downloadAsset(asset)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Usage Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-700 mb-2">✓ Correct Usage</h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Use "ness." with lowercase</li>
                      <li>• Dot always in #00ade8</li>
                      <li>• Maintain clear space around logo</li>
                      <li>• Use on contrasting backgrounds</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-700 mb-2">✗ Incorrect Usage</h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• Don't stretch or distort</li>
                      <li>• Don't change colors</li>
                      <li>• Don't add effects or shadows</li>
                      <li>• Don't use on busy backgrounds</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Press Releases Tab */}
          <TabsContent value="releases" className="space-y-6">
            <div className="space-y-4">
              {pressReleases.map((release, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{release.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{release.excerpt}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(release.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Media Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Contact</CardTitle>
                <CardDescription>For press inquiries and interview requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">Email</div>
                    <div className="font-medium text-slate-900">press@ness.com.br</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">Phone</div>
                    <div className="font-medium text-slate-900">+55 11 3000-0000</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">Website</div>
                    <div className="font-medium text-[#00ade8]">www.ness.com.br</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">Address</div>
                    <div className="font-medium text-slate-900">São Paulo, Brazil</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leadership */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#00ade8]" />
                  <CardTitle className="text-base">Leadership</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {leadership.map((member, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="font-semibold text-slate-900">{member.name}</div>
                      <div className="text-sm text-[#00ade8]">{member.role}</div>
                      <div className="text-xs text-slate-500 mt-1">{member.description}</div>
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
