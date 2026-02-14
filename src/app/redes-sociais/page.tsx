'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Download,
  Loader2,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Image,
  ExternalLink,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Platform specifications
const platforms = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0A66C2',
    formats: [
      { name: 'Post', width: 1200, height: 1200, description: 'Square post' },
      { name: 'Banner', width: 1584, height: 396, description: 'Profile banner' },
      { name: 'Article', width: 1200, height: 628, description: 'Article cover' },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    formats: [
      { name: 'Post', width: 1080, height: 1080, description: 'Square post' },
      { name: 'Story', width: 1080, height: 1920, description: 'Vertical story' },
      { name: 'Reel', width: 1080, height: 1920, description: 'Vertical reel' },
      { name: 'Carousel', width: 1080, height: 1080, description: 'Slide post' },
    ],
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: Twitter,
    color: '#000000',
    formats: [
      { name: 'Post', width: 1200, height: 675, description: 'Timeline post' },
      { name: 'Header', width: 1500, height: 500, description: 'Profile header' },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    formats: [
      { name: 'Post', width: 1200, height: 630, description: 'Timeline post' },
      { name: 'Cover', width: 820, height: 312, description: 'Page cover' },
      { name: 'Event', width: 1920, height: 1080, description: 'Event cover' },
    ],
  },
];

// Post templates
const postTemplates = [
  {
    id: 'announcement',
    name: 'Announcement',
    description: 'Company news and updates',
    preview: '📢 Big News!',
  },
  {
    id: 'promotion',
    name: 'Promotion',
    description: 'Products and services',
    preview: '🚀 Special Offer',
  },
  {
    id: 'event',
    name: 'Event',
    description: 'Webinars and events',
    preview: '📅 Join Us',
  },
  {
    id: 'tip',
    name: 'Tips',
    description: 'Educational content',
    preview: '💡 Security Tip',
  },
  {
    id: 'quote',
    name: 'Quote',
    description: 'Inspirational quotes',
    preview: '💭 Quote of the Day',
  },
];

export default function RedesSociaisPage() {
  const { user, loading: authLoading, isDemoMode } = useAuth();
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [selectedTemplate, setSelectedTemplate] = useState('announcement');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user && !isDemoMode) {
      router.push('/');
    }
  }, [user, authLoading, router, isDemoMode]);

  const downloadTemplate = (platformId: string, format: { name: string; width: number; height: number }) => {
    toast({
      title: 'Download started',
      description: `${platformId.charAt(0).toUpperCase() + platformId.slice(1)} ${format.name} (${format.width}x${format.height}px)`,
    });
  };

  const currentPlatform = platforms.find(p => p.id === selectedPlatform);
  const currentTemplate = postTemplates.find(t => t.id === selectedTemplate);

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
                <h1 className="text-xl font-bold text-slate-900">Social Media</h1>
                <p className="text-xs text-slate-500">Assets and guidelines</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              4 platforms
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="formats" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="formats" className="gap-2">
              <Image className="h-4 w-4" />
              Size Guide
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <Download className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          {/* Size Guide Tab */}
          <TabsContent value="formats" className="space-y-6">
            {/* Platform Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    variant={selectedPlatform === platform.id ? 'default' : 'outline'}
                    className={`gap-2 ${selectedPlatform === platform.id ? 'bg-slate-900 text-white' : ''}`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {platform.name}
                  </Button>
                );
              })}
            </div>

            {/* Format Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPlatform?.formats.map((format, index) => (
                <Card key={index} className="overflow-hidden">
                  <div
                    className="aspect-video bg-slate-100 flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${currentPlatform.color}15, ${currentPlatform.color}05)`,
                    }}
                  >
                    <div
                      className="border-2 border-dashed border-slate-300 flex items-center justify-center"
                      style={{
                        width: `${(format.width / Math.max(format.width, format.height)) * 80}%`,
                        height: `${(format.height / Math.max(format.width, format.height)) * 80}%`,
                        maxWidth: '90%',
                        maxHeight: '90%',
                      }}
                    >
                      <div className="text-center p-2">
                        <div className="text-lg font-bold text-slate-400">
                          {format.width}×{format.height}
                        </div>
                      </div>
                    </div>
                    <div
                      className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentPlatform.color }}
                    >
                      {(() => {
                        const Icon = currentPlatform.icon;
                        return <Icon className="h-3 w-3 text-white" />;
                      })()}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{format.name}</h3>
                        <p className="text-sm text-slate-500">{format.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadTemplate(currentPlatform.id, format)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            {/* Template Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {postTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? 'default' : 'outline'}
                  className={selectedTemplate === template.id ? 'bg-[#00ade8] text-white' : ''}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {template.name}
                </Button>
              ))}
            </div>

            {/* Template Preview */}
            <Card>
              <CardHeader>
                <CardTitle>{currentTemplate?.name} Templates</CardTitle>
                <CardDescription>{currentTemplate?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <Card key={platform.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                        <div
                          className="aspect-square flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${platform.color}20, ${platform.color}10)`,
                          }}
                        >
                          <div className="text-center">
                            <Icon className="h-12 w-12 mx-auto mb-2" style={{ color: platform.color }} />
                            <div className="text-sm font-medium text-slate-900">{currentTemplate?.preview}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {platform.formats[0].width}×{platform.formats[0].height}
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <Button className="w-full" size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tips Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Image Quality</h4>
                <p className="text-sm text-slate-600">Use high-resolution images. PNG for graphics, JPEG for photos.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Consistent Branding</h4>
                <p className="text-sm text-slate-600">Always use NESS colors: #00ade8 as primary accent.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Safe Zones</h4>
                <p className="text-sm text-slate-600">Keep important content 10% away from edges.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
