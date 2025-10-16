import { Component, inject, signal, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service';
import { EduMessagesComponent } from '../../../../shared/components/edu-messages/edu-messages.component';
import { NgOptimizedImage } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChanelOtpService } from '../services/chanel.otp.service';
import { getValueOrEmpty } from '../../../../shared/utility/fonction';

@Component({
  selector: 'app-chanel-otp',
  imports: [EduMessagesComponent, NgOptimizedImage, RouterLink],
  providers: [BsModalService],
  templateUrl: './chanel-otp.component.html',
  styleUrl: './chanel-otp.component.scss',
})
export class ChanelOtpComponent {
  form = signal(new FormGroup({}));
  channels = [
/*    {
      key: 'whatsapp',
      label: 'Envoyer par WhatsApp',
      icon: 'bx bxl-whatsapp',
      btnClass: 'whatsapp-btn',
    },*/
    { key: 'sms', label: 'Envoyer par SMS', icon: 'bx bx-message-detail', btnClass: 'sms-btn' },
/*
    { key: 'email', label: 'Envoyer par Email', icon: 'bx bx-envelope', btnClass: 'email-btn' },
*/
  ];

  // This will store the masked phone number received from the previous step
  maskedPhoneNumber = signal('');
  selectedChannel = signal<string>('');
  modalRef?: BsModalRef;
  private modalService = inject(BsModalService);

  private chanelOtpService = inject(ChanelOtpService);
  private router = inject(Router);
  private authService = inject(AuthService);


  openModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.show(content);
  }

  /**
   * Send OTP via the selected channel
   * @param channel The channel to send the OTP through
   * @param content
   */
  sendOtp(channel: string, content: TemplateRef<any>) {
    this.maskedPhoneNumber.set(
      getValueOrEmpty(
        channel !== 'email'
          ? this.authService.userContext.phone
          : this.authService.userContext.email
      )
    );
    this.selectedChannel.set(channel);
    this.openModal(content);
  }

  confirmOtp() {
    this.chanelOtpService
      .otpRequest(
        getValueOrEmpty(this.authService.userContext.userId),
        this.maskedPhoneNumber(),
        this.selectedChannel()
      )
      .subscribe({
        next: res => {
          console.log(res);
          void this.router.navigate(['otp-verification', this.selectedChannel()]);
          void this.modalRef?.hide();
        },
      });
  }
}
