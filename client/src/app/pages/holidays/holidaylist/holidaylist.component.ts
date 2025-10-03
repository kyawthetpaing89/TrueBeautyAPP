import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { GeneralService } from '../../../services/general-service';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { holiday_get_model } from '../../../models/holiday-model';
import { HolidayService } from '../../../services/holiday-service';
import { HolidayregisterDialogComponent } from '../../dialog/holidays/holidayregister-dialog/holidayregister-dialog.component';
import { DialogService } from '../../../services/dialog-service';

@Component({
  selector: 'app-holidaylist',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './holidaylist.component.html',
  styleUrl: './holidaylist.component.scss',
})
export class HolidaylistComponent {
  @ViewChild('calendarContainer', { static: true })
  calendarEl!: ElementRef<HTMLDivElement>;
  private calendar!: Calendar;

  private dialog = inject(MatDialog);
  private generalservice = inject(GeneralService);
  private holidayservice = inject(HolidayService);
  private dialogservice = inject(DialogService);

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

  holidaysData: any[] = [];

  private clientID = 'your_client_id.apps.googleusercontent.com';
  private apiKey = 'your_api_key';
  private scopes = 'https://www.googleapis.com/auth/calendar';

  ngAfterViewInit() {
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

    this.loadHolidays();
  } 

  ngOnDestroy() {
    this.calendar.destroy();
  }

  ngOnInit(): void {
    this.generalservice.setPageTitle('Sales Report');
    this.selectedyear = new Date().getFullYear();
    for (let year = this.selectedyear; year >= 2024; year--) {
      this.years.push(year);
    }
  }

  dateclick(info: any) {
    const clickedDateStr = info.dateStr;
    const existingEvents = this.calendar.getEvents();
    const clickedDate = new Date(clickedDateStr);

    if (clickedDate.getDay() === 1) {
      return;
    }

    const eventExists = existingEvents.some((event) => {
      const eventDateStr = event.start?.toISOString().split('T')[0];
      return eventDateStr === clickedDateStr;
    });

    if (eventExists) {
      const htmlContent = `
              <p>
                Holiday's already registered.
              </p>
            `;

      this.dialogservice.showMessage('Error', htmlContent);
      return;
    }

    // No event exists, proceed to open dialog
    this.openRegisterDialog('New', clickedDateStr, '');
  }

  eventclick(info: any) {
    const clickedEvent = info.event;
    const clickedDate: Date = clickedEvent.start!;

    if (clickedDate.getDay() === 1) {
      return;
    }

    this.openRegisterDialog(
      'Delete',
      this.generalservice.getFormattedDate(clickedDate),
      clickedEvent.title
    );
  }

  loadHolidays() {
    const year = this.selectedyear;
    const month = this.selectedmonth;
    const targetDate = new Date(year, month, 1); // ✅ fix month offset
    this.calendar.gotoDate(targetDate); // ⬅️ Moves calendar
    this.fetchHolidays();
  }

  fetchHolidays() {
    const year = this.selectedyear;
    const month = this.selectedmonth;

    const model = holiday_get_model({
      YYYY: year.toString(),
      MM: month.toString(),
    });

    this.holidayservice.getHoliday(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.holidaysData = response.data?.data;

          // Clear existing events
          this.calendar.removeAllEvents();

          // Add actual holiday events
          this.holidaysData.forEach((holiday: any) => {
            this.calendar.addEvent({
              title: holiday.Description || 'Holiday',
              date: holiday.HolidayDate,
              allDay: true,
              color: '#e9748fff',
            });
          });

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
                color: '#74b6e9ff',
                allDay: true,
              });
            }
          }
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  openRegisterDialog(mode: string, date: string, title: string): void {
    const param = {
      Mode: mode,
      HolidayDate: date,
      Description: title ?? '',
    };
    debugger;

    const dialogRef = this.dialog.open(HolidayregisterDialogComponent, {
      data: param,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.fetchHolidays(); // Refresh holidays after dialog closes
      }
    });
  }
}
