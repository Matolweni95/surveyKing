
import { Injectable } from '@angular/core';
import { Client } from 'pg';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  private client: Client;
  constructor() {
    this.client = new Client({
      user: 'your_username',
      password: 'your_password',
      host: 'your_host',
      port: 5432,
      database: 'your_database'
    });
  }
}


export const environment = {
  YOUR_SUPABASE_URL:'https://vsucbdlsktvbtglwviho.supabase.co',
  YOUR_SUPABASE_API_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdWNiZGxza3R2YnRnbHd2aWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3NDkyMDksImV4cCI6MjAwMjMyNTIwOX0.CYMRzv_JObFeZmxK0j4Cz6Z0rN8XZxtF995HcCxT09g'

};

export class EnvConfig {
  public static DB_HOST = 'localhost';
  public static DB_PORT = '5432';
  public static DB_NAME = 'surveydb';
  public static DB_USER = 'rootUser';
  public static DB_PASSWORD = 'buh!e1995';
}


