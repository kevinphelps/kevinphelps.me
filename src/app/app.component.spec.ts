import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent]
    });

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    nativeElement = fixture.nativeElement;
  });

  it('should render title in a h1 tag', () => {
    expect(nativeElement.querySelector('h1')?.textContent).toBe('Welcome to kevinphelps-me!');
  });
});
