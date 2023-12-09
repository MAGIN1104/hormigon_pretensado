export class Method {
  calculatePred(L: number): number {
    return Math.round((L / 18) * 100) / 100;
  }

  redondearSum(x: number): number {
    return x
  }
  redondear(x: number): number {
    return x
  }
  /**
   * =======================================================
   * PERDIDAS POR FRICCION Y CURVATURA
   * =======================================================
   */

  //TENSION A MEDIO TRAMO
  calcularTensionMedioTramo(
    P: number | undefined,
    A: number | undefined
  ): number {
    if (!P || !A) return 0;
    return this.redondear(P! / A!);
  }

  // LONGITUD DE LA TRAYECTORIA DEL CABLE A CONSIDERAR
  calcularLongitudTrayectoria(L: number): number {
    return this.redondear(L / 2);
  }

  //SUMATORIA DE DESVIACIONES
  calcularSumDesviaciones(e: number, x: number): number {
    const o = Math.tanh((2 * e) / x);
    return this.redondearSum(o);
  }

  //TENSION INICIAL
  calcularTensionInicial(
    fm: number | undefined,
    k: number | undefined,
    x: number | undefined,
    u: number | undefined,
    o: number | undefined
  ): number {
    if (!fm || !k || !x || !u || !o) return 0;
    const fo = fm / Math.pow(Math.E, -(k * x + u * o));
    return this.redondear(fo);
  }

  //VERIFICACION
  calcularVerificacion(
    fo: number | undefined,
    fpu: number | undefined
  ): number {
    if (!fo || !fpu) return 0;
    return this.redondear(fo / fpu);
  }

  //CAIDA DE TENSION POR FRICCION Y CURVATURA
  cacularCaidaTensionFriCur(
    fo: number | undefined,
    fm: number | undefined
  ): number {
    if (!fo || !fm) return 0;
    return this.redondear(fo - fm);
  }

  //FUERZA DE PRETENSADO EN EL ANCLAJE
  calcularFuerzaPretensadoAnclaje(
    At: number | undefined,
    fo: number | undefined
  ): number {
    if (!At || !fo) return 0;
    return this.redondear(At * fo);
  }

  //PERDIDAS
  calcularPfric(Po: number | undefined, Pi: number | undefined): number {
    if (!Po || !Pi) return 0;
    return this.redondear(Po - Pi);
  }
  calcularPfric_(tf: number | undefined, At: number | undefined): number {
    if (!tf || !At) return 0;
    return this.redondear(tf * At);
  }

  /**
   * =======================================================
   * PERDIDAS POR HUNDIMIENTO Y ANCLAJE
   * =======================================================
   */

  // LONGITUD DE LA TRAYECTORIA DEL CABLE A CONSIDERAR
  calcularTrayectoriaCable(
    hc: number | undefined,
    Ea: number | undefined,
    L: number | undefined,
    tf: number | undefined
  ): number {
    if (!hc || !Ea || !L || !tf) return 0;
    const x = Math.sqrt((hc * Ea * L) / (2 * tf * 1000));
    return this.redondear(x);
  }

  // CASO 1
  validarCasoUno(x1: number, x2: number): boolean {
    return x2 <= x1;
  }

  calculoTesado_TH(hc: number, Ea: number, x2: number): number {
    const th = (2 * hc * Ea) / (x2 * 1000);
    return this.redondear(th);
  }
  calculoTesado_FO(fo: number, th: number): number {
    return this.redondear(fo - th);
  }

  // CASO 2
  validarCasoDos(x1: number, x2: number): boolean {
    return x2 > x1;
  }

  // TESADO LADO 1
  calcularTesadoL1(hc: number, Ea: number, x2: number): number {
    const th = (2 * Ea * hc) / (x2 * 1000);
    return this.redondear(th);
  }
  // TESADO LADO 2
  calcularTesadoL2(h: number, Ea: number, L: number): number {
    const th = (2 * Ea * h) / (L * 1000);
    return this.redondear(th);
  }

  // TESADO LADO 2.1
  calcularTesadoL2_1(fo: number, tf: number, th: number): number {
    const f_o = fo - 2 * tf - th;
    return this.redondear(f_o);
  }

  // CASO 3
  validarCasoTres(x2: number, L: number): boolean {
    return x2 >= L;
  }

  calcularTh_C3(hc: number, L: number, Ea: number): number {
    const th = (hc / L) * Ea;
    return this.redondear(th);
  }
  //SI X=L
  calcular_fo_1(fo: number, th: number): number {
    const f_o = fo - 2 * th;
    return this.redondear(f_o);
  }
  //SI X=L
  calcular_fo_2(fo: number, th: number, tf: number): number {
    const f_o = fo - 2 * tf - th;
    return this.redondear(f_o);
  }
  //FUERZA DE PRETENSADO DESPUES DEL ANCLAJE
  calculoPretensadoDespAnclaje(fo: number, At: number): number {
    return this.redondear(fo * At);
  }
  //PERDIDAS POR HUNDIMIENTO
  calcularPerdidasPorHundimiento(Po: number, Pi: number): number {
    const Phun = Po - Pi;
    return this.redondear(Phun);
  }
  calcularPerdidasPorHundimiento2(th: number, At: number): number {
    const Phun = th * At;
    return this.redondear(Phun);
  }

  /**
   * =======================================================
   * PERDIDAS POR ACORTAMIENTO ELASTICO
   * =======================================================
   */

  //MODULO DE ELASTICIDAD DEL HORMIGON INICIAL
  calculoElasticidad(Yh: number | undefined, Fci: number | undefined): number {
    if (!Yh || !Fci) return 0;
    const E = 0.14 * Math.pow(Yh, 1.5) * Math.sqrt(Fci);
    return this.redondear(E);
  }

  //TENSION FISURACION
  calculoTensionFisuracion(
    Pi: number | undefined,
    A: number | undefined,
    e: number | undefined,
    I: number | undefined,
    Mdc: number | undefined
  ): number {
    if (!Pi || !A || !e || !I || !Mdc) return 0;
    const Fcir =
      -(Pi / A) - ((Pi * Math.pow(e, 2) * 10000) / I) + ((Mdc * e * 10000) / I);
    return this.redondear(Fcir);
  }
  calculoES(Ea: number,Eci: number, Fcir: number): number {
    if (!Ea || !Fcir) return 0;
    const ES = (0.5 * Ea * -Fcir) / Eci;
    return this.redondear(ES);
  }

  //PERDIDA POR ACORTAMIENTO ELASTICO
  calculoP_ES(Es: number, Ar: number): number {
    if (!Es || !Ar) return 0;
    return this.redondear(Es * Ar);
  }

  /**
   * =======================================================
   * PERDIDAS DIFERIDAS
   * =======================================================
   */

  //PERDIDA POR FRECUENCIA DEL HORMIGON
  calculoFcds(
    Mll: number | undefined,
    e: number | undefined,
    I: number | undefined
  ): number {
    if (!Mll || !e || !I) return 0;
    const fcds = ((Mll * e) / I) * 10000;
    return this.redondear(fcds);
  }

  calculoFcir2(
    P1: number | undefined,
    e: number | undefined,
    Mll: number | undefined,
    A: number | undefined,
    I: number | undefined
  ): number {
    if (!P1 || !e || !Mll || !A || !I) return 0;
    const fcir2 =
      -P1 / A - (P1 * Math.pow(e, 2) * 10000) / I + (Mll * e * 10000) / I;
    return this.redondear(fcir2);
  }

  calculoCrc(fcir: number | undefined, fcds: number | undefined): number {
    if (!fcir || !fcds) return 0;
    const Crc = -12 * fcir - 7 * fcds;
    return this.redondear(Crc);
  }

  //PERDIDAS POR FRECUENCIA DEL HORMIGO
  calculoPerdidaFrecuenciaHormigon(
    Crc: number | undefined,
    At: number | undefined
  ): number {
    if (!Crc || !At) return 0;
    const P_CRc = Crc * At;
    return this.redondear(P_CRc);
  }

  /**
   * =======================================================
   * PERDIDAS POR RETRACCION DEL HORMIGON
   * =======================================================
   */
  calculoSH(RH: number | undefined): number {
    if (!RH) return 0;
    const SH = 0.8 * (1190 - (10.5 * RH));
    return this.redondear(SH);
  }

  calculoP_SH(SH: number | undefined, At: number | undefined): number {
    if (!SH || !At) return 0;
    const P_SH = SH * At;
    return this.redondear(P_SH);
  }

  /**
   * =======================================================
   * PERDIDAS POR RELAJACION DE ACERO
   * =======================================================
   */
  calculoCRs(
    ES: number | undefined,
    SH: number | undefined,
    CRc: number | undefined
  ): number {
    if (!ES || !SH || !CRc) return 0;
    const CRs = 1400 - 0.4 * -ES - 0.2 * (SH + CRc);
    return this.redondear(CRs);
  }
  calculoP_CRs(CRs: number | undefined, At: number | undefined): number {
    if (!CRs || !At) return 0;
    const P_CRs = CRs * At;
    return this.redondear(P_CRs);
  }

  /**
   * =======================================================
   * RESUMEN PERDIDAS
   * =======================================================
   */

  calculoPerdidasCentro(
    Po: number | undefined,
    Pfric: number | undefined,
    P_ES: number | undefined,
    P_CRc: number | undefined,
    P_SH: number | undefined,
    P_CRs: number | undefined
  ): number {
    if (!Po || !Pfric || !P_ES || !P_CRc || !P_SH || !P_CRs) return 0;
    const x = (Po - (Pfric + P_ES + P_CRc + P_SH + P_CRs)) / Po;
    return this.redondear(x);
  }

  //PERDIDA DIFERIDA
  calcularC(
    CRc: number | undefined,
    SH: number | undefined,
    CRs: number | undefined,
    ES: number | undefined
  ): number {
    if (!CRc || !SH || !CRs || !ES) return 0;
    const C = CRc + SH + CRs + ES;
    return this.redondear(C);
  }

  calcularPf(
    fm: number | undefined,
    C: number | undefined,
    At: number | undefined
  ): number {
    if (!fm || !C || !At) return 0;
    const Pf = (fm - C) * At;
    return this.redondear(Pf);
  }

  calculoN2(Pf: number | undefined, Po: number | undefined): number {
    if (!Pf || !Po) return 0;
    return this.redondear(Pf / Po);
  }
}
