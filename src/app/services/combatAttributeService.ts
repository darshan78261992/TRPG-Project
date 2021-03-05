import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
})
export class CombatAttributeService {
    constructor(private http: HttpClient) {
    }

    getCombatAttributes(): Observable<any> {
        return this.http.get('/assets/tempData/combatAttributeData.json');
    }
}
