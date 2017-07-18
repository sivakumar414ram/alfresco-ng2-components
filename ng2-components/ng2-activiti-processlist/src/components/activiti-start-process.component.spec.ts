/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { DebugElement, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdSelectModule
} from '@angular/material';
import { RestVariable } from 'alfresco-js-api';
import { ActivitiFormModule, FormService } from 'ng2-activiti-form';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { ActivitiProcessService } from '../services/activiti-process.service';
import { newProcess, taskFormMock, testProcessDefRepr, testProcessDefs, testProcessDefWithForm } from './../assets/activiti-start-process.component.mock';
import { TranslationMock } from './../assets/translation.service.mock';
import { ProcessDefinitionRepresentation } from './../models/process-definition.model';
import { ActivitiStartProcessInstanceComponent } from './activiti-start-process.component';

describe('ActivitiStartProcessInstanceComponent', () => {

    let componentHandler: any;
    let component: ActivitiStartProcessInstanceComponent;
    let fixture: ComponentFixture<ActivitiStartProcessInstanceComponent>;
    let processService: ActivitiProcessService;
    let formService: FormService;
    let getDefinitionsSpy: jasmine.Spy;
    let getStartFormDefinitionSpy: jasmine.Spy;
    let startProcessSpy: jasmine.Spy;
    let debugElement: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                ActivitiFormModule.forRoot(),
                MdProgressSpinnerModule,
                MdButtonModule,
                MdCardModule,
                MdInputModule,
                MdSelectModule
            ],
            declarations: [
                ActivitiStartProcessInstanceComponent
            ],
            providers: [
                {provide: AlfrescoTranslationService, useClass: TranslationMock},
                ActivitiProcessService,
                FormService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiStartProcessInstanceComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        element = fixture.nativeElement;
        processService = fixture.debugElement.injector.get(ActivitiProcessService);
        formService = fixture.debugElement.injector.get(FormService);

        getDefinitionsSpy = spyOn(processService, 'getProcessDefinitions').and.returnValue(Observable.of(testProcessDefs));
        startProcessSpy = spyOn(processService, 'startProcess').and.returnValue(Observable.of(newProcess));
        getStartFormDefinitionSpy = spyOn(formService, 'getStartFormDefinition').and.returnValue(Observable.of(taskFormMock));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should create instance of ActivitiStartProcessInstanceComponent', () => {
        expect(fixture.componentInstance instanceof ActivitiStartProcessInstanceComponent).toBe(true, 'should create ActivitiStartProcessInstanceComponent');
    });

    describe('process definitions list', () => {

        it('should call service to fetch process definitions with appId', () => {
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            expect(getDefinitionsSpy).toHaveBeenCalledWith('123');
        });

        it('should call service to fetch process definitions without appId', () => {
            let change = new SimpleChange(null, null, true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            expect(getDefinitionsSpy).toHaveBeenCalledWith(null);
        });

        it('should call service to fetch process definitions with appId when provided', () => {
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            expect(getDefinitionsSpy).toHaveBeenCalledWith('123');
        });

        it('should display the correct number of processes in the select list', () => {
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            let selectElement = fixture.nativeElement.querySelector('md-select');
            expect(selectElement.children.length).toBeGreaterThan(0);
            expect(selectElement.children.length).toBe(1);
        });

        it('should defined the process selector def details', async(() => {
            component.name = 'My new process';
            let change = new SimpleChange(null, '123', true);
            component.onProcessDefChange('my:process1');
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let selectElement = fixture.nativeElement.querySelector('md-select');
                expect(selectElement.textContent.trim()).toBe('START_PROCESS.FORM.LABEL.TYPE');
                expect(selectElement.children.length).toBe(1);
            });
        }));

        it('should defined the options', async(() => {
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            component.onProcessDefChange('my:process1');
            component.processDefinitions = testProcessDefs;
            component.name = 'My new process';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                let selectElement = fixture.nativeElement.querySelector('md-select > .mat-select-trigger');
                selectElement.click();
                let optionElement = fixture.nativeElement.querySelectorAll('md-option');
                console.log(optionElement);
                expect(optionElement).not.toBeNull();
                expect(optionElement).toBeDefined();
            });
        }));

        it('should indicate an error to the user if process defs cannot be loaded', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(Observable.throw({}));
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                let errorEl = fixture.nativeElement.querySelector('#error-message');
                expect(errorEl).not.toBeNull('Expected error message to be present');
                expect(errorEl.innerText.trim()).toBe('START_PROCESS.ERROR.LOAD_PROCESS_DEFS');
            });
        }));

        it('should show no process available message when no process definition is loaded', async(() => {
            getDefinitionsSpy = getDefinitionsSpy.and.returnValue(Observable.of([]));
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                let noprocessElement = fixture.nativeElement.querySelector('#no-process-message');
                expect(noprocessElement).not.toBeNull('Expected no available process message to be present');
                expect(noprocessElement.innerText.trim()).toBe('START_PROCESS.NO_PROCESS_DEFINITIONS');
            });
        }));
    });

    describe('input changes', () => {

        let change = new SimpleChange('123', '456', true);
        let nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.appId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                getDefinitionsSpy.calls.reset();
            });
        }));

        it('should reload processes when appId input changed', () => {
            component.ngOnChanges({appId: change});
            expect(getDefinitionsSpy).toHaveBeenCalledWith('456');
        });

        it('should reload processes when appId input changed to null', () => {
            component.ngOnChanges({appId: nullChange});
            expect(getDefinitionsSpy).toHaveBeenCalledWith(null);
        });

        it('should get current processDeff', () => {
            component.ngOnChanges({appId: change});
            component.onProcessDefChange('my:Process');
            fixture.detectChanges();
            expect(getDefinitionsSpy).toHaveBeenCalled();
            expect(component.processDefinitions).toBe(testProcessDefs);
        });
    });

    describe('start process', () => {

        beforeEach(() => {
            component.name = 'My new process';
            let change = new SimpleChange(null, '123', true);
            component.ngOnChanges({'appId': change});
        });

        it('should call service to start process if required fields provided', async(() => {
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).toHaveBeenCalled();
            });
        }));

        it('should avoid calling service to start process if required fields NOT provided', async(() => {
            component.name = '';
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).not.toHaveBeenCalled();
            });
        }));

        it('should call service to start process with the correct parameters', async(() => {
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).toHaveBeenCalledWith('my:process1', 'My new process', undefined, undefined, undefined);
            });
        }));

        it('should call service to start process with the variables setted', async(() => {
            let inputProcessVariable: RestVariable[] = [];

            let variable: RestVariable = {};
            variable.name = 'nodeId';
            variable.value = 'id';

            inputProcessVariable.push(variable);

            component.variables = inputProcessVariable;
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(startProcessSpy).toHaveBeenCalledWith('my:process1', 'My new process', undefined, undefined, inputProcessVariable);
            });
        }));

        it('should output start event when process started successfully', async(() => {
            let emitSpy = spyOn(component.start, 'emit');
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(emitSpy).toHaveBeenCalledWith(newProcess);
            });
        }));

        it('should throw error event when process cannot be started', async(() => {
            let errorSpy = spyOn(component.error, 'error');
            let error = {message: 'My error'};
            startProcessSpy = startProcessSpy.and.returnValue(Observable.throw(error));
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                expect(errorSpy).toHaveBeenCalledWith(error);
            });
        }));

        it('should indicate an error to the user if process cannot be started', async(() => {
            startProcessSpy = startProcessSpy.and.returnValue(Observable.throw({}));
            component.onProcessDefChange('my:process1');
            component.startProcess();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let errorEl = fixture.nativeElement.querySelector('#error-message');
                expect(errorEl).not.toBeNull();
                expect(errorEl.innerText.trim()).toBe('START_PROCESS.ERROR.START');
            });
        }));

        it('should emit start event when start the process with currentProcessDef and name', () => {
            let startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.currentProcessDef.id = '1001';
            component.name = 'my:Process';
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).toHaveBeenCalled();
        });

        it('should not emit start event when start the process without currentProcessDef and name', () => {
            let startSpy: jasmine.Spy = spyOn(component.start, 'emit');
            component.startProcess();
            fixture.detectChanges();
            expect(startSpy).not.toHaveBeenCalled();
        });

        it('should true if form is valid', async(() => {
            component.currentProcessDef = new ProcessDefinitionRepresentation(testProcessDefRepr);
            component.name = 'my:process1';
            component.currentProcessDef.id = '1001';
            component.isStartFormMissingOrValid();
            component.validateForm();
            fixture.whenStable().then(() => {
                expect(component.validateForm()).toBe(true);
            });
        }));

        it('should true if startFrom defined', async(() => {
            component.currentProcessDef = new ProcessDefinitionRepresentation(testProcessDefRepr);
            component.name = 'my:process1';
            component.currentProcessDef.hasStartForm = true;
            component.hasStartForm();
            fixture.whenStable().then(() => {
                expect(component.hasStartForm()).toBe(true);
            });
        }));
    });

    describe('start forms', () => {

    let startBtn;

    describe('without start form', () => {

            beforeEach(async(() => {
                component.name = 'My new process';
                let change = new SimpleChange(null, '123', true);
                component.ngOnChanges({'appId': change});
                fixture.detectChanges();
                component.onProcessDefChange('my:process1');
                fixture.whenStable();
                startBtn = fixture.nativeElement.querySelector('#button-start');
            }));

            it('should have start button disabled when name not filled out', async(() => {
                component.name = '';
                fixture.detectChanges();
                expect(startBtn.disabled).toBe(true);
            }));

            it('should have start button disabled when no process is selected', async(() => {
                component.onProcessDefChange('');
                fixture.detectChanges();
                expect(startBtn.disabled).toBe(true);
            }));

            it('should enable start button when name and process filled out', async(() => {
                let startButton = fixture.nativeElement.querySelector('#button-start');
                fixture.detectChanges();
                expect(startButton.enable).toBeFalsy();
            }));
        });

    describe('with start form', () => {

            beforeEach(() => {
                getDefinitionsSpy.and.returnValue(Observable.of(testProcessDefWithForm));
                let change = new SimpleChange(null, '123', true);
                component.ngOnChanges({'appId': change});
                component.onProcessDefChange('my:process1');
                fixture.detectChanges();
                fixture.whenStable();
            });

            it('should initialize start form', () => {
                expect(component.startForm).toBeDefined();
                expect(component.startForm).not.toBeNull();
            });

            it('should load start form from service', () => {
                expect(getStartFormDefinitionSpy).toHaveBeenCalled();
            });

            it('should emit cancel event on cancel Button', () => {
                let cancelButton =  fixture.nativeElement.querySelector('#cancle_process');
                let cancelSpy: jasmine.Spy = spyOn(component.cancel, 'emit');
                cancelButton.click();
                fixture.detectChanges();
                expect(cancelSpy).toHaveBeenCalled();
            });

        });

    });

});
