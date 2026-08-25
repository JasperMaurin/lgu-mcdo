import {
    ArchiveBoxIcon,
    BuildingOffice2Icon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
    HomeIcon,
    QueueListIcon,
    UserGroupIcon,
    UserIcon,
    QrCodeIcon,
} from '@heroicons/react/24/outline';

export function buildNavSections(pathname = '/dashboard') {
    const anchor = (id) => `/dashboard#${id}`;
    return [
        {
            id: 'main',
            title: 'Overview',
            icon: HomeIcon,
            collapsible: false,
            items: [
                {
                    label: 'Dashboard Overview',
                    href: '/dashboard',
                    icon: HomeIcon,
                    active: pathname === '/dashboard',
                },
            ],
        },
        {
            id: 'cooperatives',
            title: 'Cooperative Management',
            icon: BuildingOffice2Icon,
            collapsible: true,
            items: [
                {
                    label: 'Cooperative Profiling',
                    href: '/cooperatives/profiling',
                    icon: BuildingOffice2Icon,
                    active: pathname === '/cooperatives/profiling',
                },
            ],
        },
        {
            id: 'feedback',
            title: 'Feedback Management',
            icon: ChatBubbleLeftRightIcon,
            collapsible: true,
            badge: 123,
            items: [
                {
                    label: 'Generate QR Code',
                    href: '/feedback/generate-qr',
                    icon: QrCodeIcon,
                    active: pathname === '/feedback/generate-qr',
                },
                {
                    label: 'All Feedback',
                    href: '/feedback/all',
                    icon: QueueListIcon,
                    active: pathname === '/feedback/all',
                },
                {
                    label: 'Pending Feedback',
                    href: anchor('feedback'),
                    icon: ClipboardDocumentCheckIcon,
                    badge: 84,
                },
                {
                    label: 'Under Review',
                    href: anchor('feedback'),
                    icon: DocumentTextIcon,
                    badge: 39,
                },
                {
                    label: 'Resolved Feedback',
                    href: anchor('feedback'),
                    icon: CheckCircleIcon,
                },
                {
                    label: 'Archived Feedback',
                    href: anchor('feedback'),
                    icon: ArchiveBoxIcon,
                },
            ],
        },
        {
            id: 'members',
            title: 'Members & Directory',
            icon: UserGroupIcon,
            collapsible: true,
            items: [
                { label: 'Farmers', href: anchor('members'), icon: UserIcon },
                { label: 'Cooperative Members', href: anchor('members'), icon: UserGroupIcon },
                { label: 'Associations', href: anchor('members'), icon: UserGroupIcon },
            ],
        },
    ];
}

export const SIDEBAR_WIDTH = { expanded: 280, collapsed: 72 };

