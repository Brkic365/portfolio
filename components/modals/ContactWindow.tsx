import { useState } from 'react';
import { Send, Github, Linkedin, Mail, MapPin, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import Window from '../ui/Window';

interface ContactWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactWindow = ({ isOpen, onClose }: ContactWindowProps) => {
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        fromEmail: '',
        subject: '',
        message: '',
        company: '', // Honeypot — kept empty by real users.
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSending(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSent(true);
                setFormData({ name: '', fromEmail: '', subject: '', message: '', company: '' });
                setTimeout(() => setIsSent(false), 4000);
            } else {
                const data = await response.json().catch(() => null);
                setError(data?.error || 'Something went wrong. Please try again or email me directly.');
            }
        } catch {
            setError('Network error. Please check your connection or email me directly.');
        } finally {
            setIsSending(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Window
            title="Mail — New Message"
            isOpen={isOpen}
            onClose={onClose}
            initialSize={{ width: 850, height: 600 }}
            center
        >
            <div className="flex flex-col md:flex-row bg-slate-900/40 h-full overflow-y-auto md:overflow-hidden">

                {/* LEFT COLUMN: Profile */}
                <div className="w-full md:w-[300px] bg-black/20 border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8 flex flex-col items-center text-center gap-4 shrink-0">

                    {/* Profile Header: Avatar + Text */}
                    <div className="flex flex-row md:flex-col items-center gap-4 md:gap-0 w-full md:w-auto md:justify-center">
                        {/* Avatar */}
                        <div className="relative mb-0 md:mb-6 shrink-0">
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-slate-700 ring-2 ring-white/10 overflow-hidden shadow-2xl">
                                {avatarError ? (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-2xl md:text-3xl">
                                        👨‍💻
                                    </div>
                                ) : (
                                    <img
                                        src="/avatar.jpg"
                                        alt="Antonio Brkić"
                                        className="w-full h-full object-cover"
                                        onError={() => setAvatarError(true)}
                                    />
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-black/50 shadow-sm md:block hidden" title="Available for work" />
                        </div>

                        {/* Name & Title */}
                        <div className="text-left md:text-center flex-1 md:flex-none">
                            <h3 className="text-xl md:text-xl font-bold text-slate-100 mb-0 md:mb-1">Antonio Brkić</h3>
                            <p className="text-sm text-slate-400 font-medium">Full-Stack Engineer</p>
                        </div>
                    </div>

                    {/* Details: Location + Status */}
                    <div className="flex flex-row md:flex-col flex-wrap justify-start md:justify-center gap-2 w-full md:w-auto md:mb-8 md:mt-1.5">
                        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300 bg-white/5 p-2 rounded-lg border border-white/5">
                            <MapPin size={14} className="text-blue-400" />
                            <span>Zagreb, HR</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300 bg-white/5 p-2 rounded-lg border border-white/5">
                            <CheckCircle2 size={14} className="text-green-400" />
                            <span>Available</span>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4 w-full md:w-auto justify-start md:justify-center md:mt-auto">
                        <a href="https://github.com/Brkic365" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white" title="GitHub">
                            <Github size={20} />
                        </a>
                        <a href="https://linkedin.com/in/antonio-brkic" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-blue-400" title="LinkedIn">
                            <Linkedin size={20} />
                        </a>
                        <a href="mailto:contact@antoniobrkic.com" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-green-400" title="Email" aria-label="Email">
                            <Mail size={20} />
                        </a>
                    </div>

                    {/* Resume Download */}
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full mt-4 md:mt-6 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium text-slate-200 transition-colors"
                    >
                        <FileText size={16} />
                        Download Résumé
                    </a>
                </div>

                {/* RIGHT COLUMN: Composer */}
                <div className="flex-1 flex flex-col p-6 md:p-8 bg-slate-900/80 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            New Message
                        </h2>
                        {isSent && <span className="text-green-400 text-sm font-medium animate-pulse">Message Sent!</span>}
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                        {/* Honeypot — hidden from users, catches bots */}
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            className="hidden"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="group">
                                <label htmlFor="contact-name" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block" style={{ marginBottom: '0.5rem' }}>Name</label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Jane Doe"
                                    autoComplete="name"
                                    maxLength={100}
                                    className="w-full bg-black/20 focus:bg-black/40 rounded-lg px-4 border-b border-white/10 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-medium font-[family-name:var(--font-jetbrains-mono)]"
                                    required
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="contact-email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block" style={{ marginBottom: '0.5rem' }}>Your Email</label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    name="fromEmail"
                                    value={formData.fromEmail}
                                    onChange={handleChange}
                                    placeholder="jane@company.com"
                                    autoComplete="email"
                                    maxLength={254}
                                    className="w-full bg-black/20 focus:bg-black/40 rounded-lg px-4 border-b border-white/10 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-medium font-[family-name:var(--font-jetbrains-mono)]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block" style={{ marginBottom: '0.5rem' }}>Subject</label>
                            <input
                                id="contact-subject"
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Project/Work Inquiry..."
                                maxLength={200}
                                className="w-full bg-black/20 focus:bg-black/40 rounded-lg px-4 border-b border-white/10 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-medium text-lg font-[family-name:var(--font-jetbrains-mono)]"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col group">
                            <label htmlFor="contact-message" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block" style={{ marginBottom: '0.5rem' }}>Message</label>
                            <textarea
                                id="contact-message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Hi Antonio, I'd like to talk about..."
                                maxLength={5000}
                                className="flex-1 w-full bg-black/20 focus:bg-black/40 rounded-lg p-4 border-none resize-none text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-0 text-base leading-relaxed font-[family-name:var(--font-jetbrains-mono)]"
                                required
                            />
                        </div>

                        {error && (
                            <div role="alert" className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-white/10">
                            <button
                                type="submit"
                                disabled={isSending || isSent}
                                className={`
                        flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
                        ${isSent
                                        ? 'bg-green-500 text-white cursor-default'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                                    }
                    `}
                            >
                                {isSending ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin cursor-not-allowed" />
                                ) : isSent ? (
                                    <span className="cursor-not-allowed flex items-center gap-2">Sent <CheckCircle2 size={18} /></span>
                                ) : (
                                    <span className="cursor-pointer text-white flex items-center gap-2">Send Message <Send size={18} /></span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </Window>
    );
};

export default ContactWindow;
