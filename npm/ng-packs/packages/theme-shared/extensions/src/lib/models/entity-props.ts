import { Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import { O } from 'ts-toolbelt';
import { ABP } from '@abp/ng.core';
import { ActionCallback } from './actions';
import {
  Prop,
  PropCallback,
  PropContributorCallback,
  PropContributorCallbacks,
  PropList,
  Props,
  PropsFactory,
} from './props';

export class EntityPropList<R = any> extends PropList<R, EntityProp<R>> {}

export class EntityProps<R = any> extends Props<EntityPropList<R>> {
  protected _ctor: Type<EntityPropList<R>> = EntityPropList;
}

export class EntityPropsFactory<R = any> extends PropsFactory<EntityProps<R>> {
  protected _ctor: Type<EntityProps<R>> = EntityProps;
}

export class EntityProp<R = any> extends Prop<R> {
  readonly columnWidth: number | undefined;
  readonly sortable: boolean;
  readonly valueResolver: PropCallback<R, Observable<any>>;
  readonly action: ActionCallback<R>;
  readonly component: Type<any>;
  readonly enumList: Array<ABP.Option<any>>;

  constructor(options: EntityPropOptions<R>) {
    super(
      options.type,
      options.name,
      options.displayName,
      options.permission,
      options.visible,
      options.isExtra,
    );

    this.columnWidth = options.columnWidth;
    this.sortable = options.sortable || false;
    this.valueResolver = options.valueResolver || (data => of(data.record[this.name]));
    this.action = options.action;
    this.component = options.component;
    this.enumList = options.enumList;
  }

  static create<R = any>(options: EntityPropOptions<R>) {
    return new EntityProp<R>(options);
  }

  static createMany<R = any>(arrayOfOptions: EntityPropOptions<R>[]) {
    return arrayOfOptions.map(EntityProp.create);
  }
}

export type EntityPropOptions<R = any> = O.Optional<
  O.Writable<EntityProp<R>>,
  | 'permission'
  | 'visible'
  | 'displayName'
  | 'isExtra'
  | 'columnWidth'
  | 'sortable'
  | 'valueResolver'
  | 'action'
  | 'component'
  | 'enumList'
>;

export type EntityPropDefaults<R = any> = Record<string, EntityProp<R>[]>;
export type EntityPropContributorCallback<R = any> = PropContributorCallback<EntityPropList<R>>;
export type EntityPropContributorCallbacks<R = any> = PropContributorCallbacks<EntityPropList<R>>;
