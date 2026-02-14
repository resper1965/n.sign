'use client'

import { useEffect, useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, QrCode } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast, Toaster } from 'sonner'

interface SignatureData {
  id: string
  nome: string
  sobrenome: string
  area: string
  email: string
  telefone: string | null
  linkedin: string | null
  whatsapp: string | null
  template: string
  theme: string
  createdAt: string
}

const AREAS: Record<string, string> = {
  ceo: 'CEO | Chief Executive Officer',
  cfo: 'CFO | Chief Financial Officer',
  cto: 'CTO | Chief Technology Officer',
  coo: 'COO | Chief Operating Officer',
  cmo: 'CMO | Chief Marketing Officer',
  cio: 'CIO | Chief Information Officer',
  cso: 'CSO | Chief Security Officer',
  chro: 'CHRO | Chief Human Resources Officer',
  cpo: 'CPO | Chief Product Officer',
  cdo: 'CDO | Chief Data Officer',
  secops: 'n.secops | Security Operations',
  infraops: 'n.infraops | Infrastructure Operations',
  devarch: 'n.devarch | Development Architecture',
  autoops: 'n.autoops | Automation Operations',
  privacy: 'n.privacy | Privacy & Compliance',
  cirt: 'n.cirt | Cyber Incident Response',
  discovery: 'n.discovery | Digital Discovery',
  operations: 'Operations | Infrastructure & IT Security',
  security: 'IT Security & Governance',
  forensic: 'IT Security & Forensic',
  finance: 'Backoffice | Finance',
  hr: 'Backoffice | HR',
  facilities: 'Backoffice | Facilities',
}

export default function SharedSignaturePage() {
  const [signature, setSignature] = useState<SignatureData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    const fetchSignature = async () => {
      // Get slug from URL path (e.g., /s/abc123 -> abc123)
      const pathParts = window.location.pathname.split('/')
      const slug = pathParts[pathParts.length - 1]

      if (!slug || slug === 's') {
        setError('Slug não encontrado')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/signatures/${slug}`)
        const data = await res.json()

        if (data.error) {
          setError(data.error)
        } else {
          setSignature(data.signature)
        }
      } catch {
        setError('Erro ao carregar assinatura')
      } finally {
        setLoading(false)
      }
    }

    fetchSignature()
  }, [])

  const capitalize = (str: string) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
  }

  const getThemeStyles = () => {
    switch (signature?.theme) {
      case 'azul':
        return { bg: 'bg-slate-900', logoColor: '#fff', nameColor: '#fff', areaColor: '#cbd5e1', textColor: '#e2e8f0', borderColor: '#00ade8' }
      case 'dark':
        return { bg: 'bg-slate-900', logoColor: '#fff', nameColor: '#f1f5f9', areaColor: '#94a3b8', textColor: '#cbd5e1', borderColor: '#334155' }
      default:
        return { bg: 'bg-white', logoColor: '#0f172a', nameColor: '#0f172a', areaColor: '#64748b', textColor: '#334155', borderColor: '#00ade8' }
    }
  }

  const themeStyles = getThemeStyles()

  const generateVCard = () => {
    if (!signature) return ''
    return `BEGIN:VCARD
VERSION:3.0
N:${signature.sobrenome};${signature.nome};;;
FN:${signature.nome} ${signature.sobrenome}
ORG:NESS
TITLE:${AREAS[signature.area] || signature.area}
TEL;TYPE=WORK,VOICE:+55 11 2504-7650
${signature.telefone ? `TEL;TYPE=CELL,VOICE:+55 ${signature.telefone}` : ''}
EMAIL:${signature.email}
URL:https://www.ness.com.br
END:VCARD`
  }

  const generateQRCode = async () => {
    try {
      const vcard = generateVCard()
      const QRCode = (await import('qrcode')).default
      const url = await QRCode.toDataURL(vcard, { width: 300, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } })
      setQrCodeUrl(url)
      setShowQRModal(true)
    } catch {
      toast.error('Erro ao gerar QR Code')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ade8] mx-auto mb-4"></div>
          <div className="text-slate-400 text-lg">Carregando...</div>
        </div>
      </div>
    )
  }

  if (error || !signature) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || 'Assinatura não encontrada'}</div>
          <Button onClick={() => window.location.href = '/'} className="bg-[#00ade8] hover:bg-[#008bb8] text-white">
            Voltar ao Início
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 font-montserrat flex flex-col items-center justify-center p-4 md:p-6">
      <Toaster position="top-right" />

      <div className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-lg w-full border border-slate-700">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-medium text-slate-100 tracking-tight mb-2">
            n<span className="text-[#00ade8]">.</span>sign
          </h1>
          <p className="text-slate-400 text-sm">Assinatura Compartilhada</p>
        </div>

        {/* Signature Preview */}
        <div className={`${themeStyles.bg} rounded-xl p-6 mb-6 transition-colors`}>
          <table cellPadding={0} cellSpacing={0} style={{ fontFamily: "'Montserrat', Arial, sans-serif", width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '120px', verticalAlign: 'middle', textAlign: 'center', borderRight: `2px solid ${themeStyles.borderColor}`, paddingRight: '15px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 500, color: themeStyles.logoColor }}>
                    ness<span style={{ color: '#00ade8' }}>.</span>
                  </div>
                </td>
                <td style={{ paddingLeft: '15px', verticalAlign: 'middle' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>
                    <span style={{ color: themeStyles.nameColor }}>{capitalize(signature.nome)}</span>{' '}
                    <span style={{ color: '#00ade8' }}>{capitalize(signature.sobrenome)}</span>
                  </div>
                  <div style={{ fontSize: '8px', color: themeStyles.areaColor, textTransform: 'uppercase', fontWeight: 600, marginBottom: '10px', letterSpacing: '0.5px' }}>
                    {AREAS[signature.area] || signature.area}
                  </div>
                  <table cellPadding={0} cellSpacing={0} style={{ fontSize: '10px' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '16px', paddingRight: '5px', verticalAlign: 'middle' }}>
                          <img src="https://img.icons8.com/ios/30/00ade8/phone.png" width={12} height={12} style={{ display: 'block' }} alt="Phone" />
                        </td>
                        <td style={{ paddingBottom: '3px', color: themeStyles.textColor, verticalAlign: 'middle' }}>
                          +55 (11) 2504-7650
                        </td>
                      </tr>
                      {signature.telefone && (
                        <tr>
                          <td style={{ width: '16px', paddingRight: '5px', verticalAlign: 'middle' }}>
                            <img src="https://img.icons8.com/ios/30/00ade8/iphone.png" width={12} height={12} style={{ display: 'block' }} alt="Mobile" />
                          </td>
                          <td style={{ paddingBottom: '3px', color: themeStyles.textColor, verticalAlign: 'middle' }}>
                            +55 {signature.telefone}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td style={{ width: '16px', paddingRight: '5px', verticalAlign: 'middle' }}>
                          <img src="https://img.icons8.com/ios/30/00ade8/new-post.png" width={12} height={12} style={{ display: 'block' }} alt="Email" />
                        </td>
                        <td style={{ paddingBottom: '3px', color: themeStyles.textColor, verticalAlign: 'middle' }}>
                          {signature.email}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: '16px', paddingRight: '5px', verticalAlign: 'middle' }}>
                          <img src="https://img.icons8.com/ios/30/00ade8/domain.png" width={12} height={12} style={{ display: 'block' }} alt="Website" />
                        </td>
                        <td style={{ color: themeStyles.textColor, verticalAlign: 'middle' }}>
                          <a href="https://www.ness.com.br" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>ness.com.br</a>
                        </td>
                      </tr>
                      {(signature.linkedin || signature.whatsapp) && (
                        <tr>
                          {signature.linkedin && (
                            <>
                              <td style={{ width: '16px', paddingRight: '5px', verticalAlign: 'middle', paddingTop: '6px' }}>
                                <img src="https://img.icons8.com/ios/30/00ade8/linkedin.png" width={12} height={12} style={{ display: 'block' }} alt="LinkedIn" />
                              </td>
                              <td style={{ color: themeStyles.textColor, verticalAlign: 'middle', paddingTop: '6px' }}>
                                <a href={signature.linkedin.startsWith('http') ? signature.linkedin : `https://linkedin.com/in/${signature.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>LinkedIn</a>
                              </td>
                            </>
                          )}
                          {signature.whatsapp && (
                            <>
                              <td style={{ width: '16px', paddingLeft: signature.linkedin ? '10px' : '0', paddingRight: '5px', verticalAlign: 'middle', paddingTop: '6px' }}>
                                <img src="https://img.icons8.com/ios/30/00ade8/whatsapp.png" width={12} height={12} style={{ display: 'block' }} alt="WhatsApp" />
                              </td>
                              <td style={{ color: themeStyles.textColor, verticalAlign: 'middle', paddingTop: '6px' }}>
                                <a href={`https://wa.me/55${signature.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>WhatsApp</a>
                              </td>
                            </>
                          )}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(`${signature.nome} ${signature.sobrenome}\n${AREAS[signature.area]}\n📧 ${signature.email}\n📞 +55 ${signature.telefone || ''}\n🌐 ness.com.br`)
              toast.success('Contato copiado!')
            }}
            className="h-11 bg-[#00ade8] hover:bg-[#008bb8] text-white font-medium text-sm rounded-lg transition-all duration-200"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar Contato
          </Button>
          <Button
            onClick={generateQRCode}
            className="h-11 border-2 border-[#00ade8] text-[#00ade8] hover:bg-[#00ade8] hover:text-white font-medium text-sm rounded-lg transition-all duration-200"
            variant="outline"
          >
            <QrCode className="w-4 h-4 mr-2" />
            QR Code
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 pt-4 border-t border-slate-700">
          <a href="https://www.ness.com.br" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-400 text-xs">
            © 2026 n.sign | NESS. Todos os direitos reservados.
          </a>
        </div>
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-300 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#00ade8] text-xl font-medium">QR Code vCard</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-xl">
              {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />}
            </div>
            <p className="text-slate-400 text-sm text-center">
              Escaneie para adicionar contato
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
