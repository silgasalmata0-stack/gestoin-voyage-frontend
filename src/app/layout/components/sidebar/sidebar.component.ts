import { Component, signal } from '@angular/core';

interface SubItem {
  label: string;
}

interface MenuItem {
  label: string;
  iconPath: string;
  children: SubItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isCollapsed = signal(false);
  expandedItem = signal<string | null>(null);

  readonly menuItems: MenuItem[] = [
    {
      label: 'Utilisateurs',
      iconPath:
        'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      children: [
        { label: 'Créer un utilisateur' },
        { label: 'Lister les utilisateurs' },
      ],
    },
    {
      label: 'Sessions',
      iconPath:
        'M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z',
      children: [
        { label: 'Ouvrir une session' },
        { label: 'Session active' },
        { label: 'Lister les sessions' },
        { label: 'Clôturer la session' },
      ],
    },
    {
      label: 'Zones & Tarifs',
      iconPath:
        'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      children: [
        { label: 'Lister les zones' },
        { label: 'Créer une zone' },
      ],
    },
    {
      label: 'Demandes',
      iconPath:
        'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
      children: [
        { label: 'Soumettre une demande' },
        { label: 'Mes demandes' },
        { label: 'Toutes les demandes' },
      ],
    },
    {
      label: 'Budget',
      iconPath:
        'M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
      children: [
        { label: 'Consulter le budget' },
        { label: 'Initialiser le budget' },
        { label: "Verser l'acompte (90%)" },
        { label: 'Verser le solde (10%)' },
      ],
    },
    {
      label: 'Justificatifs',
      iconPath:
        'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',
      children: [
        { label: 'Lister les justificatifs' },
        { label: 'Déposer un justificatif' },
      ],
    },
    {
      label: 'Reports',
      iconPath:
        'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z',
      children: [
        { label: 'Demander un report' },
        { label: 'Reports en attente' },
        { label: 'Mes reports' },
      ],
    },
    {
      label: 'Notifications',
      iconPath:
        'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
      children: [
        { label: 'Mes notifications' },
        { label: 'Marquer toutes comme lues' },
      ],
    },
    {
      label: 'Journal',
      iconPath:
        'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
      children: [
        { label: 'Toutes les activités' },
        { label: 'Par période' },
        { label: 'Par action' },
      ],
    },
  ];

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
    if (this.isCollapsed()) {
      this.expandedItem.set(null);
    }
  }

  toggleItem(label: string): void {
    if (this.isCollapsed()) return;
    this.expandedItem.update((cur) => (cur === label ? null : label));
  }

  isExpanded(label: string): boolean {
    return this.expandedItem() === label;
  }
}
