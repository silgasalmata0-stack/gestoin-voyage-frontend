import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-page">
      <div class="placeholder-card">
        <div class="placeholder-icon">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
        </div>
        <h2>{{ title }}</h2>
        <p>Cette section est en cours de développement.</p>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-page {
      display: flex; align-items: center; justify-content: center;
      min-height: 60vh;
    }
    .placeholder-card {
      text-align: center; padding: 48px 40px;
      background: #fff; border-radius: 16px;
      border: 1.5px solid #e2e8f0;
      max-width: 380px;
    }
    .placeholder-icon {
      width: 64px; height: 64px; border-radius: 50%;
      background: #eff6ff; display: flex; align-items: center;
      justify-content: center; margin: 0 auto 20px;
    }
    .placeholder-icon svg { width: 32px; height: 32px; color: #0D47A1; }
    h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
    p  { font-size: 13px; color: #64748b; }
  `]
})
export class PlaceholderComponent {
  private route = inject(ActivatedRoute);
  readonly title = this.route.snapshot.data['title'] ?? 'Page';
}
