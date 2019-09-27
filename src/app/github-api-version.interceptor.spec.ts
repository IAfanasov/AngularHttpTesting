import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { GitHubApiVersionInterceptor } from './github-api-version.interceptor';


describe('GitHubApiVersionInterceptor', () => {
  let httpMock: HttpTestingController;
  let client: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: GitHubApiVersionInterceptor,
        multi: true,
      }]
    });

    client = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);
  });

  it(`should add Accept header with value 'application/vnd.github.v3.star+json'
      when requested https://api.github.com/*`, () => {
    client.get('https://api.github.com/anything').subscribe();

    const requests = httpMock.match({ method: 'get' });

    expect(requests[0].request.headers.get('Accept'))
      .toEqual('application/vnd.github.v3.star+json');
  });

  it(`should NOT add Accept header when requested NOT https://api.github.com/*`, () => {
    client.get('https://not-a-github-api.com/anything').subscribe();

    const requests = httpMock.match({ method: 'get' });

    expect(requests[0].request.headers.has('Accept')).toEqual(false);
  });

});
