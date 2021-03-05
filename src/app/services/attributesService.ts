import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AttributesService {

    constructor(private http: HttpClient) {
    }

    getAttributes(): Observable<any> {
        return this.http.get('/assets/tempData/attributesData.json');
    }
}
