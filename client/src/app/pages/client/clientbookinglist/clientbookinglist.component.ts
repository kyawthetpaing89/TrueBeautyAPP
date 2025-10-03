import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { GeneralService } from '../../../services/general-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Calendar, CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ClientService } from '../../../services/client-service';
import { clientbooking_get_model } from '../../../models/client-model';
import { DialogService } from '../../../services/dialog-service';
import { MatDialog } from '@angular/material/dialog';
import { ClientbookingregisterDialogComponent } from '../../dialog/client/clientbookingregister-dialog/clientbookingregister-dialog.component';
import { holiday_get_model } from '../../../models/holiday-model';
import { HolidayService } from '../../../services/holiday-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-clientbookinglist',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './clientbookinglist.component.html',
  styleUrl: './clientbookinglist.component.scss',
})
export class ClientbookinglistComponent {
  @ViewChild('calendarContainer', { static: true })
  calendarEl!: ElementRef<HTMLDivElement>;
  private calendar!: Calendar;

  private generalservice = inject(GeneralService);
  private clientservice = inject(ClientService);
  private holidayservice = inject(HolidayService);
  private dialogservice = inject(DialogService);
  private dialog = inject(MatDialog);

  slotMap: { [key: string]: string } = {
    '9': '09:00 AM - 10:00 AM',
    '10': '10:00 AM - 11:00 AM',
    '11': '11:00 AM - 12:00 PM',
    '12': '12:00 PM - 01:00 PM',
    '13': '01:00 PM - 02:00 PM',
    '14': '02:00 PM - 03:00 PM',
    '15': '03:00 PM - 04:00 PM',
    '16': '04:00 PM - 05:00 PM',
    '17': '05:00 PM - 06:00 PM',
  };

  selectedyear: number = new Date().getFullYear();
  selectedmonth: number = new Date().getMonth() + 1;

  years: number[] = [];
  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  clientBookingData: any[] = [];
  holidaysData: any[] = [];

  ngAfterViewInit(): void {
    const options: CalendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      timeZone: 'Asia/Yangon',
      headerToolbar: {
        left: '', // no prev/next
        center: 'title', // only the title shown
        right: '', // no other buttons
      },
      height: '800px',
      dateClick: (info) => this.dateclick(info),
      eventClick: (info) => this.eventclick(info),
      weekends: true,
    };

    this.calendar = new Calendar(this.calendarEl.nativeElement, options);
    this.calendar.render();

    this.loadCalendarInfo();
  }

  ngOnInit(): void {
    this.generalservice.setPageTitle('Client Booking');
    this.selectedyear = new Date().getFullYear();
    for (let year = this.selectedyear; year >= 2024; year--) {
      this.years.push(year);
    }
  }

  async loadCalendarInfo() {
    const year = this.selectedyear;
    const month = this.selectedmonth;
    const targetDate = new Date(year, month, 1); // ✅ fix month offset
    this.calendar.gotoDate(targetDate); // ⬅️ Moves calendar

    await this.loadClientBooking();
    await this.loadHolidays();

    this.calendar.removeAllEvents();
    this.addCalendarEvents();
  }

  async loadClientBooking() {
    const model = clientbooking_get_model({
      YYYY: this.selectedyear.toString(),
      MM: this.selectedmonth.toString(),
    });

    try {
      const response = await firstValueFrom(
        this.clientservice.getClientBooking(model)
      );
      if (response.status) {
        this.clientBookingData = response.data?.data || [];
      } else {
        console.error('Failed to fetch client bookings:', response.message);
        this.clientBookingData = [];
      }
    } catch (error) {
      console.error('Error fetching client bookings:', error);
      this.clientBookingData = [];
    }
  }

  async loadHolidays() {
    const model = holiday_get_model({
      YYYY: this.selectedyear.toString(),
      MM: this.selectedmonth.toString(),
    });

    try {
      const response = await firstValueFrom(
        this.holidayservice.getHoliday(model)
      );
      if (response.status) {
        this.holidaysData = response.data?.data || [];
      } else {
        console.error('Failed to fetch holidays:', response.message);
        this.holidaysData = [];
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
      this.holidaysData = [];
    }
  }

  addCalendarEvents() {
    this.clientBookingData.forEach((booking: any) => {
      this.calendar.addEvent({
        title:
          (this.getBookingSlot(booking.BookingSlot) || 'No Description') +
          (booking.Name ? ' - ' + booking.Name : ''),
        date: booking.BookingDate,
        allDay: true,
        color: '#e9748fff',
        extendedProps: {
          BookingCD: booking.BookingCD,
          ClientID: booking.ClientID,
          Name: booking.Name,
          BookingDate: booking.BookingDate,
          Notes: booking.Notes,
          BookingSlot: booking.BookingSlot,
        },
      });
    });

    // Add actual holiday events
    this.holidaysData.forEach((holiday: any) => {
      this.calendar.addEvent({
        title: holiday.Description || 'Holiday',
        date: holiday.HolidayDate,
        allDay: true,
        color: '#00000061',
      });
    });

    const year = this.selectedyear;
    const month = this.selectedmonth;
    const jsMonth = month - 1; // Adjust if your input month is 1-based

    let startDate = new Date(Date.UTC(year, jsMonth, 1));
    let endDate = new Date(Date.UTC(year, jsMonth + 1, 0));

    // Add 7-day buffer before and after
    startDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    endDate = new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const MYANMAR_OFFSET_MS = 6.5 * 60 * 60 * 1000; // +06:30 for Myanmar

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setUTCDate(date.getUTCDate() + 1)
    ) {
      // Convert to Myanmar time
      const myanmarDate = new Date(date.getTime() + MYANMAR_OFFSET_MS);

      // Get the day in Myanmar timezone (0=Sunday, 1=Monday, ..., 6=Saturday)
      const myanmarDay = myanmarDate.getUTCDay();

      if (myanmarDay === 1) {
        // Monday
        const iso = myanmarDate.toISOString().split('T')[0];
        this.calendar.addEvent({
          title: 'Shop Closed',
          date: iso,
          color: '#00000061',
          allDay: true,
        });
      }
    }
  }

  dateclick(info: any) {
    const clickedDateStr = info.dateStr;
    const clickedDate = new Date(clickedDateStr);

    // Block Mondays
    if (clickedDate.getDay() === 1) {
      return;
    }

    // Block Holidays — directly check in holidaysData
    const isHoliday = this.holidaysData.some(
      (holiday) =>
        this.generalservice.getFormattedDate(holiday.HolidayDate) ===
        this.generalservice.getFormattedDate(clickedDateStr)
    );

    if (isHoliday) {
      return;
    }

    this.openRegisterDialog('New', clickedDateStr, '');
  }

  eventclick(info: any) {
    const clickedEvent = info.event;
    const clickedDate: Date = clickedEvent.start!;

    if (clickedDate.getDay() === 1) {
      return;
    }

    // Block Holidays — directly check in holidaysData
    const isHoliday = this.holidaysData.some(
      (holiday) =>
        this.generalservice.getFormattedDate(holiday.HolidayDate) ===
        this.generalservice.getFormattedDate(clickedDate)
    );

    if (isHoliday) {
      return;
    }

    const event = info.event;

    this.openRegisterDialog(
      'Cancel',
      this.generalservice.getFormattedDate(clickedDate),
      event
    );
  }

  getBookingSlot(slot: string): string {
    return this.slotMap[slot] || 'Unknown Slot';
  }

  openRegisterDialog(mode: string, date: string, event: any): void {
    const bookingsOnDate = this.clientBookingData.filter(
      (booking) =>
        this.generalservice.getFormattedDate(booking.BookingDate) ===
        this.generalservice.getFormattedDate(date)
    );

    const bookedSlots: string[] = bookingsOnDate.map((b) => b.BookingSlot);

    const param = {
      Mode: mode,
      BookingDate: this.generalservice.getFormattedDate(date),
      BookingSlots: bookedSlots,
      Event: event,
    };

    const dialogRef = this.dialog.open(ClientbookingregisterDialogComponent, {
      data: param,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadCalendarInfo(); // Refresh holidays after dialog closes
      }
    });
  }
}
