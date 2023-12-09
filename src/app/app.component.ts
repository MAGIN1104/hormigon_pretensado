import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Method } from './utils/methods';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'civil_project';
  isEditableCalculate: boolean = false;
  @ViewChild('stepper') stepper!: MatStepper;

  //PREDIMENSIONAMIENTO
  h: number = 0;
  ec1: string = 'h=L/18 =';

  formGroup!: FormGroup;
  isEditable = true;

  constructor(private _fb: FormBuilder) {
    this.formGroup = this._fb.group({});
  }
  onStepChange(event: any, form: FormGroup) {
    console.log('*******', event, form.valid);
    // Verifica si el formulario es válido antes de cambiar de paso
    if (event.previouslySelectedStep) {
      if (!this.formGroup.valid) {
        this.stepper.selectedIndex = event.previouslySelectedStep.index;
      }
    }
  }
  validateForm($event: FormGroup) {
    console.log('++++++++', $event.valid);
    this.formGroup = $event;
    console.log('++++++++', this.formGroup.valid);
    this.validarCasos();
  }

  get getTensionMedioTramo(): number {
    const x = new Method().calcularTensionMedioTramo(
      this.formGroup.controls['p1Value']?.value,
      this.formGroup.controls['AtValue']?.value
    );
    return x;
  }
  get longitudTrayectoria(): number {
    if (!this.formGroup.controls['LValue']?.value) return 0;
    const x = new Method().calcularLongitudTrayectoria(
      this.formGroup.controls['LValue']?.value
    );
    return x;
  }
  get getSumatoriaDesviaciones(): number {
    if (!this.formGroup.controls['eValue']?.value) return 0;
    const x = new Method().calcularSumDesviaciones(
      this.formGroup.controls['eValue']?.value,
      this.longitudTrayectoria
    );
    return x;
  }
  get getTensionInicial(): number {
    const x = new Method().calcularTensionInicial(
      this.getTensionMedioTramo,
      this.formGroup.controls['KValue']?.value,
      this.longitudTrayectoria,
      this.formGroup.controls['uValue']?.value,
      this.getSumatoriaDesviaciones
    );
    return x;
  }

  get getVerificar(): boolean {
    const x = new Method().calcularVerificacion(
      this.getTensionInicial,
      this.formGroup.controls['fpuValue']?.value
    );
    return x <= 0.8;
  }
  get getCaidaTensionFricCurv(): number {
    const x = new Method().cacularCaidaTensionFriCur(
      this.getTensionInicial,
      this.getTensionMedioTramo
    );
    return x;
  }
  get getFuerzaPretensado(): number {
    const x = new Method().calcularFuerzaPretensadoAnclaje(
      this.formGroup.controls['AtValue']?.value,
      this.getTensionInicial
    );
    return x;
  }

  get getPerdidaFric1(): number {
    const x = new Method().calcularPfric(
      this.getFuerzaPretensado,
      this.formGroup.controls['p1Value']?.value
    );
    return x;
  }
  get getPerdidaFric2(): number {
    const x = new Method().calcularPfric_(
      this.getCaidaTensionFricCurv,
      this.formGroup.controls['AtValue']?.value
    );
    return x;
  }
  get getLongitudTrayectoriaCable(): number {
    const x = new Method().calcularTrayectoriaCable(
      this.formGroup.controls['hcValue']?.value,
      this.formGroup.controls['EaValue']?.value,
      this.formGroup.controls['LValue']?.value,
      this.getCaidaTensionFricCurv
    );
    return x;
  }

  th: number = 0;
  f_o: number = 0;
  CASO: string = '';
  validarCasos() {
    const method = new Method();
    if (
      method.validarCasoUno(
        this.longitudTrayectoria,
        this.getLongitudTrayectoriaCable
      )
    ) {
      this.CASO = 'UNO';
      this.th = method.calculoTesado_TH(
        this.formGroup.controls['hcValue']?.value,
        this.formGroup.controls['EaValue']?.value,
        this.getLongitudTrayectoriaCable
      );
      this.f_o = method.calculoTesado_FO(this.getTensionInicial, this.th);
    } else if (
      method.validarCasoDos(
        this.getLongitudTrayectoriaCable,
        this.formGroup.controls['LValue']?.value / 2
      )
    ) {
      this.CASO = 'DOS';
      if (this.formGroup.controls['LValue']?.value > 35) {
        this.th = method.calcularTesadoL1(
          this.formGroup.controls['hcValue']?.value,
          this.formGroup.controls['EaValue']?.value,
          this.getLongitudTrayectoriaCable
        );
      } else {
        this.th = method.calcularTesadoL2(
          this.formGroup.controls['hcValue']?.value,
          this.formGroup.controls['EaValue']?.value,
          this.formGroup.controls['LValue']?.value
        );
      }
      this.f_o = method.calcularTesadoL2_1(
        this.getTensionInicial,
        this.getCaidaTensionFricCurv,
        this.th
      );
    } else {
      this.CASO = 'TRES';
      this.th = method.calcularTh_C3(
        this.formGroup.controls['hcValue']?.value,
        this.formGroup.controls['LValue']?.value,
        this.formGroup.controls['EaValue']?.value
      );
      if (
        this.getLongitudTrayectoriaCable ==
        this.formGroup.controls['LValue']?.value
      ) {
        this.f_o = method.calcular_fo_1(this.getTensionInicial, this.th);
      } else if (
        this.getLongitudTrayectoriaCable >
        this.formGroup.controls['LValue']?.value
      ) {
        this.f_o = method.calcular_fo_2(
          this.getTensionInicial,
          this.th,
          this.getCaidaTensionFricCurv
        );
      }
    }
  }
  get getFuerzaPrensado(): number {
    const x = new Method().calcularFuerzaPretensadoAnclaje(
      this.formGroup.controls['AtValue']?.value,
      this.f_o
    );
    return x;
  }
  get pHun(): number {
    const x = new Method().calcularPerdidasPorHundimiento(
      this.getFuerzaPretensado,
      this.getFuerzaPrensado
    );
    return x;
  }
  get pHun2(): number {
    const x = new Method().calcularPerdidasPorHundimiento2(
      this.th,
      this.formGroup.controls['AtValue']?.value
    );
    return x;
  }
  get Eci(): number {
    const x = new Method().calculoElasticidad(
      this.formGroup.controls['yhValue']?.value,
      this.formGroup.controls['fciValue']?.value
    );
    return x;
  }
  get Fcir(): number {
    const x = new Method().calculoTensionFisuracion(
      this.formGroup.controls['p1Value']?.value,
      this.formGroup.controls['AValue']?.value,
      this.formGroup.controls['eValue']?.value,
      this.formGroup.controls['IValue']?.value,
      this.formGroup.controls['MdcValue']?.value
    );
    return x;
  }

  get ES(): number {
    const x = new Method().calculoES(
      this.formGroup.controls['EaValue']?.value,
      this.Eci,
      this.Fcir
    );
    return x;
  }

  get P_ES(): number {
    const x = new Method().calculoP_ES(
      this.ES,
      this.formGroup.controls['AtValue']?.value
    );
    return x;
  }

  get Fcds(): number {
    const x = new Method().calculoFcds(
      this.formGroup.controls['MllValue']?.value,
      this.formGroup.controls['eValue']?.value,
      this.formGroup.controls['IValue']?.value
    );
    return x;
  }

  get Fcir2(): number {
    const x = new Method().calculoFcir2(
      this.formGroup.controls['p1Value']?.value,
      this.formGroup.controls['eValue']?.value,
      this.formGroup.controls['MllValue']?.value,
      this.formGroup.controls['AValue']?.value,
      this.formGroup.controls['IValue']?.value
    );
    return x;
  }

  get Crc(): number {
    const x = new Method().calculoCrc(this.Fcir2, this.Fcds);
    return x;
  }

  get P_CRc(): number {
    const x = new Method().calculoPerdidaFrecuenciaHormigon(
      this.Crc,
      this.formGroup.controls['AtValue']?.value
    );
    return x;
  }
  get SH(): number {
    const x = new Method().calculoSH(this.formGroup.controls['RHValue']?.value);
    return x;
  }

  get P_SH(): number {
    const x = new Method().calculoP_SH(
      this.SH,
      this.formGroup.controls['AtValue']?.value
    );
    return x;
  }

  get CRs(): number {
    const x = new Method().calculoCRs(this.ES, this.SH, this.Crc);
    return x;
  }

  get P_CRs(): number {
    const x = new Method().calculoP_CRs(
      this.CRs,
      this.formGroup.controls['AtValue']?.value
    );
    return x;
  }


  get perdida_centro(): number {
    const x = new Method().calculoPerdidasCentro(
      this.getFuerzaPretensado,
      this.getPerdidaFric2,
      this.P_ES,
      this.P_CRc,
      this.P_SH,
      this.P_CRs
    );
    return x;
  }

  get getC(): number {
    const x = new Method().calcularC(this.Crc, this.SH, this.CRs, this.ES);
    return x;
  }
  get getPf(): number {
    const x = new Method().calcularPf(
      this.getTensionMedioTramo,
      this.getC,
      this.formGroup.controls['AtValue']?.value
    );
    return x;
  }
  get getN2(): number {
    const x = new Method().calculoN2(
      this.getPf,
      this.getFuerzaPretensado
    );
    return x;
  }
}
