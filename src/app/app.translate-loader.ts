import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function AppTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
