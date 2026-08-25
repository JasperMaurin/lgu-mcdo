import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export default function WelcomeBanner() {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-blue-600 p-6 md:p-8 text-white shadow-xl"
        >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAzNGg2djZoLTZ6TTAgMzRoNnY2SDB6TTAgMGg2djZIMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" aria-hidden="true" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-yellow-300" aria-hidden="true" />
                        <span className="text-sm font-medium text-white/80">Dashboard Overview</span>
                    </div>
                    <h2 className="font-outfit text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
                        Welcome back, Admin!
                    </h2>
                    <p className="text-white/80 text-sm md:text-base max-w-xl">
                        Here&apos;s what&apos;s happening with your cooperatives today. Monitor activity, track growth, and manage registrations.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <div className="px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-center min-w-[100px]">
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-xs text-white/70">Cooperatives</p>
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-center min-w-[100px]">
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-white/70">Pending</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
