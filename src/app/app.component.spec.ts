import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Repo } from './repo';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AppComponent]
    })
      .compileComponents();

    httpMock = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should make http call to proper GitHub API url when show button is clicked`, () => {
    component.userName = 'IAfanasov';

    fixture.debugElement.query(By.css('button')).nativeElement.click();

    expect(() => httpMock.expectOne('https://api.github.com/users/IAfanasov/starred'))
      .not.toThrow();
  });

  it('should save list of starred repos from GitHub API when response received', () => {
    component.userName = 'IAfanasov';
    const repos: Repo[] = [{
      id: 1,
      created_at: '22-09-2019',
      name: 'mock',
      stargazers_count: 1000,
      updated_at: '30-09-2019'
    }];

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    const request = httpMock.expectOne('https://api.github.com/users/IAfanasov/starred');
    request.flush(repos);

    expect(component.repos).toEqual(repos);
  });

  it('should show error message when request fails', async () => {
    component.userName = 'IAfanasov';

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    const request = httpMock.expectOne('https://api.github.com/users/IAfanasov/starred');
    request.error(null);
    fixture.detectChanges();
    await fixture.whenRenderingDone();

    const alert = fixture.debugElement.query(By.css('.alert-danger'));
    expect(alert).toBeTruthy();
  });

  it('should hide the error message when request succeeded after failed one fails', async () => {
    component.userName = 'IAfanasov';

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    const requestToFail = httpMock.expectOne('https://api.github.com/users/IAfanasov/starred');
    requestToFail.error(null);
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    const requestToSucceed = httpMock.expectOne('https://api.github.com/users/IAfanasov/starred');
    requestToSucceed.flush([]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();

    const alert = fixture.debugElement.query(By.css('.alert-danger'));
    expect(alert).toBeFalsy();
  });

});
