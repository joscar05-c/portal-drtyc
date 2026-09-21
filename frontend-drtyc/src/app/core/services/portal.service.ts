import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Banner } from '../interfaces/banner.model';
import { Post } from '../interfaces/post.model';
import { DocumentItem } from '../interfaces/document.model';
import { Project } from '../interfaces/project.model';
import { StaffMember } from '../interfaces/staff.model';
import { Faq } from '../interfaces/faq.model';
import { Settings } from '../interfaces/setting.model';
import { Complaint, ComplaintResponse, ComplaintTrackRequest, ComplaintTrackResult } from '../interfaces/complaint.model';
import { PaginatedResponse } from '../interfaces/pagination.model';
import { JobPosting } from '../interfaces/job-posting.model';
import { QuickLink } from '../interfaces/quick-link.model';
import { JobCall, ApplicationStatusResult } from '../interfaces/job-call.model';
import { DocumentEntryTrack } from '../interfaces/document-entry.model';

@Injectable({ providedIn: 'root' })
export class PortalService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.apiUrl}/banners`);
  }

  getPosts(): Observable<PaginatedResponse<Post>> {
    return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/posts`);
  }

  getPostBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${slug}`);
  }

  getDocuments(params?: { year?: number; type?: string }): Observable<PaginatedResponse<DocumentItem>> {
    let httpParams = new HttpParams();
    if (params?.year) httpParams = httpParams.set('year', params.year.toString());
    if (params?.type) httpParams = httpParams.set('type', params.type);
    return this.http.get<PaginatedResponse<DocumentItem>>(`${this.apiUrl}/documents`, { params: httpParams });
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  getJobPostings(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(`${this.apiUrl}/job-postings`);
  }

  getStaff(): Observable<StaffMember[]> {
    return this.http.get<StaffMember[]>(`${this.apiUrl}/staff`);
  }

  getFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.apiUrl}/faqs`);
  }

  getSettings(): Observable<Settings> {
    return this.http.get<Settings>(`${this.apiUrl}/settings`);
  }

  sendComplaint(data: Complaint): Observable<ComplaintResponse> {
    return this.http.post<ComplaintResponse>(`${this.apiUrl}/complaints`, data);
  }

  trackComplaint(data: ComplaintTrackRequest): Observable<ComplaintTrackResult> {
    return this.http.post<ComplaintTrackResult>(`${this.apiUrl}/complaints/track`, data);
  }

  getQuickLinks(): Observable<QuickLink[]> {
    return this.http.get<QuickLink[]>(`${this.apiUrl}/quick-links`);
  }

  getJobCalls(): Observable<JobCall[]> {
    return this.http.get<JobCall[]>(`${this.apiUrl}/job-calls`);
  }

  getJobCallBySlug(slug: string): Observable<JobCall> {
    return this.http.get<JobCall>(`${this.apiUrl}/job-calls/${slug}`);
  }

  getJobCallsByType(type: string): Observable<JobCall[]> {
    return this.http.get<JobCall[]>(`${this.apiUrl}/job-calls/type/${type}`);
  }

  checkApplicationStatus(jobCallId: number, documentNumber: string): Observable<ApplicationStatusResult> {
    return this.http.post<ApplicationStatusResult>(`${this.apiUrl}/postulate/check-status`, {
      job_call_id: jobCallId,
      document_number: documentNumber,
    });
  }

  submitDocumentEntry(formData: FormData): Observable<{ message: string; tracking_number: string }> {
    return this.http.post<{ message: string; tracking_number: string }>(`${this.apiUrl}/document-entries`, formData);
  }

  trackDocumentEntry(trackingNumber: string, documentNumber: string): Observable<DocumentEntryTrack> {
    return this.http.post<DocumentEntryTrack>(`${this.apiUrl}/document-entries/track`, {
      tracking_number: trackingNumber,
      document_number: documentNumber,
    });
  }
}
