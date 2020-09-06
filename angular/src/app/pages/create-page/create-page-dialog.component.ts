import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import * as _ from "lodash";
import { AppComponentBase } from "@shared/app-component-base";
import {
  PageDto,
  PageServiceProxy,
  PageType,
} from "@shared/service-proxies/service-proxies";

import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AppPageType } from "@shared/AppEnums";
import { propertyOf } from "lodash";

@Component({
  templateUrl: "./create-page-dialog.component.html",
  styleUrls: ["../../pages/page.css"],
})
export class CreatePageDialogComponent
  extends AppComponentBase
  implements OnInit {
  public Editor = ClassicEditor;
  saving = false;
  page = new PageDto();
  pageTypeName: string;

  pageTypes: any = Object.keys(AppPageType).map((item, index) => {
    return { id: index, name: item };
  });

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _pageService: PageServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  types: string[];
  ngOnInit(): void {
    this.pageTypeName = "PleaseSelect";
  }

  save(): void {
    this.saving = true;

    this._pageService
      .create(this.page)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }

  selectPageType(type: AppPageType) {
    switch (type) {
      case AppPageType.Page: {
        this.page.pageType = AppPageType.Page;
        this.pageTypeName = "Page";
        break;
      }
      case AppPageType.News: {
        this.page.pageType = AppPageType.News;
        this.pageTypeName = "News";
        break;
      }
      case AppPageType.Article: {
        this.page.pageType = AppPageType.Article;
        this.pageTypeName = "Article";
        break;
      }

      default:
        break;
    }
  }
}

class EnumConvertor<T> {
  private readonly enumObj: T;
  constructor(enumObject: any) {
    this.enumObj = enumObject;
    return this;
  }
  getValue<U = any>(key: any): U {
    return this.enumObj[this.enumObj[key]];
  }
  getValues(): string[] {
    debugger;
    const keys = Object.keys(this.enumObj);
    return keys.slice(0, keys.length / 2);
  }
  getKeys(): string[] {
    const keys = Object.keys(this.enumObj);
    return keys.slice(keys.length / 2, keys.length);
  }
}
