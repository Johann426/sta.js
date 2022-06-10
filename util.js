
// Originally developed by prof. J. E. Kerwin at MIT
// Y = Aj(X - Xj)^3 + Aj+N-1(X - Xj)^2 + Aj+2(N-1)(X - Xj) + Aj+3(N-1)

function UGLYDK(NIN,NCL,NCR,XIN,YIN,ESL,ESR,AE) {


	REAL XIN(*),YIN(*),AE(*),H(200),D(200),AU(200),AM(200),
	* S(200),AL(200),X(200)
	DATA HALF/0.5E00/,TWO/2.OEOO/,SIX/6.OEOO/,RAD/1.745329E-02/
	NM1=NIN-1
	NM2=NM1-1
	NM3=NM2-1
	NEQ=NM2
	DO 1 N=1,NM1
	H(N)=XIN(N+1)-XIN(N)
	1 D(N)=(YIN(N+1)-YIN(N))/H(N)
	IF(NCL.EQ.2) NEQ=NEq+l
	IF(NCR.EQ.2) NEQ=NEQ+1
	NSQ=NEQ**2
	J=l
	IF(NCL.LT.2) GO TO 6
	AM(i)=TWO*H(l)
	AU(1)=H(1)
	SLP=ESL*RAD
	S(1)=(D(1)-TAN(SLP))*SIX
	J=J+1
	AL(2)=H(1)
	6 DO 5 N=1,NM2
	IF(N.GT.l) AU(J-1)=H(N)
	AM(J)=TWO*(H(N)+H(N+i))
	IF(N.LT.NM2) AL(J+1)=H(N+1)
	IF(N.EQ.2.AND.NCL.Eq.l) AU(J-1)=AU(J-1)-H(N-1)**2/H(N)
	IF(N.EQ.l.AND.NCL.EQ.l) AM(J)=AM(J)+(1.0+H(N)/H(N+1))*H(N)
	IF(N.EQ.NM2.AND.NCR.EQ.l) AM(J)=AM(J)+(1.0+H(N+1)/H(N))*H(N+1)
	IF(N.EQ.NM3.AND.NCR.EQ.l) AL(J+l)=AL(J+l)-H(N+2)**2/H(N+l)
	S(J)=(D(N+i)-D(N))*SIX
	J=J+i
	5 CONTINUE
	IF(NCR.LT.2) GO TO 7
	AL(NEQ)=-H(NM1)
	AM(NEQ)=-TWO*H(NMl)
	AU(NEQ-l)=H(NMi)
	SLP=ESR*RAD
	S(J)=(D(NM1)+TAN(SLP))*SIX
	7 CONTINUE
	DO 4 K=2,NEQ
	AL(K)=AL(K)/AM(K-1)
	AM(K)=AM(K)-AL(K)*AU(K-1)
	S(K)=S(K)-AL(K)*S(K-1)
	4 CONTINUE
	X(NEQ)=S(NEQ)/AM(NEq)
	DO 2 L=2,NEQ
	K=NEQ-L+1
	X(K)=(S(K)-AU(K)*X(K+i))/AM(K)
	2 CONTINUE
	DO 22 N=1,NEQ
	22 S(N)=X(N)
	HOLD=S(NEQ)
	IF(NCL.Eq.2) GO TO 8
	DO 9 N=1,NM2
	M=NM2-N+2
	9 S(M)=S(M-1)
	IF(NCL.EQ.O) S(1)=0.0
	BUG=H(i)/H(2)
	IF(NCL.Eq.l) S(1)=(1.0+BUG)*S(2)-BUG*S(3)
	8 IF(NCR.Eq.O) S(NIN)=0.0
	BUG=H(NM1)/H(NM2)
	IF(NCR.Eq.l) S(NIN)=(i.0+BUG)*S(NMl)-BUG*S(NM2)
	IF(NCR.Eq.2) S(NIN)=HOLD
	DO 10 N=1,NM1
	AE(N)=(S(N+1)-S(N))/(SIX*H(N))
	M=N+NM1
	AE(M)=HALF*S(N)
	M=M+NM1
	AE(M)=D(N)-H(N)*(TW0*S(N)+S(N+1))/SIX
	M=M+NM1
	10 AE(H)=YIN(N)
	RETURN

}
