import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edu-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edu-messages.component.html',
  styleUrls: ['./edu-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EduMessagesComponent {
  scrollSpeed = input(20); // secondes pour un cycle complet

  messages = [
    'Bonjour et bienvenue sur Multiflex ERP ! Votre outil centralisé pour une gestion efficace des opérations IOLA.',
    "GCT : N'oubliez pas d'enregistrer vos prospects et la localisation GPS précise des chantiers pour un suivi optimal !",
    'Astuce Multi-Sociétés : Utilisez le sélecteur en haut à droite pour basculer entre vos sociétés autorisées (BES, Usine, etc.).',
    'Gérants Distribution : Validez rapidement les commandes clients pour assurer une livraison dans les délais.',
    "Techniciens Ambassadeurs : Enregistrez le feedback de vos démonstrations pour déclencher l'étape du devis !",
    'Personnel PdV : Utilisez la recherche de devis pour enregistrer facilement les paiements des chantiers clients.',
    'Sécurité : Ne partagez jamais votre mot de passe. Déconnectez-vous après chaque session, surtout sur un poste partagé.',
    'Gestion Stocks : Assurez-vous de valider les réceptions et expéditions pour maintenir un inventaire précis en temps réel.',
    "Nouveauté : Consultez la section 'Aide' pour des guides rapides sur les fonctionnalités clés.",
    'Votre contribution est clé ! Utilisez Multiflex ERP pour des données fiables et une meilleure collaboration au sein du Groupe IOLA.',
  ];

  // Les messages doivent être dupliqués pour l'animation continue
  get duplicatedMessages(): string[] {
    // Dupliquer l'array pour créer une animation continue
    return [...this.messages, ...this.messages];
  }

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) {
    // Utiliser effect pour réagir aux changements de scrollSpeed
    effect(() => {
      this.renderer.setStyle(
        this.element.nativeElement,
        '--scroll-duration',
        `${this.scrollSpeed()}s`
      );
    });
  }
}
