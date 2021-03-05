import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SkillAttributesService {
    constructor(private http: HttpClient) {
    }

    getSkillAttributes(): Observable<any> {
        return this.http.get('/assets/tempData/skillAttributesData.json');
    }
}
