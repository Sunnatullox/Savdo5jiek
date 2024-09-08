import { formatNumber } from "../../../utils/numberToWords";
import { AdminInfo, Administrator } from "../../../types/adminstrator.type";
import { ILegalInfo, IUser } from "../../../types/user.type";

export default async function UzTshContractHtml(
  admin: Administrator & { AdminInfo: AdminInfo },
  user: IUser & { legal_info: ILegalInfo },
  products: any,
  isDelivery: boolean,
  data: any
) {
  return `
   <!DOCTYPE html>
<html lang="ru-RU">

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset="utf-8" />
	<title>
	</title>
	<style>
		body {
			line-height: 108%;
			font-family: Calibri;
			font-size: 11pt;
			padding-left: 50px;
			padding-right: 50px;
			padding-top: 50px;
			padding-bottom: 50px;
		}

		h1,
		p {
			margin: 0pt 0pt 8pt;
		}

		table {
			margin-top: 0pt;
			margin-bottom: 8pt;
		}

		h1 {
			margin-top: 24pt;
			margin-bottom: 0pt;
			page-break-inside: avoid;
			page-break-after: avoid;
			line-height: 115%;
			font-family: "Calibri Light";
			font-size: 14pt;
			font-weight: bold;
			color: #2f5496;
		}

		.NoSpacing {
			margin-bottom: 0pt;
			line-height: normal;
			font-size: 11pt;
		}

		span.Hyperlink {
			text-decoration: underline;
			color: #0563c1;
		}

		span.\x031 {
			font-family: "Calibri Light";
			font-size: 14pt;
			font-weight: bold;
			color: #2f5496;
		}

		@media (max-width: 900px) {
			img {
				max-width: 100%;
				height: auto;
			}

			.table-container {
				overflow-x: auto;
				-webkit-overflow-scrolling: touch;
			}

			table {
				width: 100%;
				border-collapse: collapse;
			}

			td,
			th {
				padding: 8px;
				text-align: left;
				border: 1px solid #ddd;
			}
		}

		.container {
			display: flex;
			justify-content: space-between;
			width: 100%;
			margin-top: 10px;
		}

		.column {
			width: 48%;
			padding-left: 100px;
			box-sizing: border-box;
			padding-top: 0;
		}

		h2 {
			margin-bottom: 10px;
			font-size: 11px;
			font-weight: bold;
		}

		p {
			font-size: 8pt;
			padding-bottom: 0;
			margin-bottom: 0;

		}

		.noSpacing {
			margin-top: 20pt;
		}

		.noSpacing_indent {
			margin-top: 50pt;
		}

		
	</style>
</head>

<body>
	<div style="float: right;">
		<img width="50" height="50" src="${data.qrcode}" alt"qr_code" >
	</div>
	<div style="margin-top: 20px;">
		<p class="NoSpacing" style="text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">Yuridik shaxslar bilan onlayn mahsulot sotish haqida ommaviy
					oferta shartnomasi </span></strong>
		</p>
		<p class="NoSpacing" style="text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">№</span></strong><strong><span
					style="font-family:Cambria;"> ${data.contractId || "_?_"}</span></strong>
		</p>
		<p class="NoSpacing" style="text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">&#xa0;</span></strong>
		</p>
		<div class="container">
			<p class="column" style="font-family:Cambria;; padding-left: 10px;">${
        data.contractDate || "_?_"
      } yil</p>
			<p class="column" style="font-family:Cambria; width: auto; padding-right: 10px;">Qiziltepa tumani</p>
		</div>
		<p class="NoSpacing" style="text-align:center">
			<strong><span style="font-family:Cambria; ">&#xa0;</span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">Bundan buyon matnda «MAHSULOT YETKAZIB BERUVCHI» deb nomlanuvchi, o‘z
				Nizomi asosida faoliyat ko‘rsatuvchi 5-son Jazoni ijro etish koloniyasi (keying o’rinlarda
			</span><strong><span style="font-family:Cambria; ">JIEK</span></strong><span style="font-family:Cambria">
				deb yuritiladi) rahbari </span><strong><span style="font-family:Cambria; ">${admin.AdminInfo.middle_name} ${admin.AdminInfo.first_name} ${admin.AdminInfo.sur_name}</span></strong><span style="font-family:Cambria"> bir tomondan, bundan buyon matnda
				«BUYURTMACHI» deb nomlanuvchi o‘z nizomi asosida faoliyat ko‘rsatuvchi yuridik shaxs</span><span
				style="font-family:Cambria">&#xa0; </span><strong><span
					style="font-family:Cambria;"> ${user.legal_info.name} </span></strong><span
				style="font-family:Cambria">ikkinchi tomondan quyidagilar to‘g‘risida ushbu shartnomani tuzdilar:</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">1.Shartnoma mazmuni</span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">1.1 Mazkur shartnomaga asosan «MAHSULOT YETKAZIB BERUVCHI» ishlab
				chiqarilgan </span> <strong><span style="font-family:Cambria;">${
          data.productsCategoryUz || "_?_"
        }</span></strong><span style="font-family:Cambria"> mahsulotlarini (keyingi oʻrinlarda
				“Maxsulot”) etkazib berish boʻyicha «BUYURTMACHI»ning buyurtmasini 5-son Jazoni ijro etish koloniyasi
				ishlab chiqarish korxonasi (keyingi oʻrinlarda – 5-son JIEKIChK)dan chiqarish va uni «BUYURTMACHI»ga
				hisob faktura asosida berib yuborish hamda uning tasarrufiga topshirishni tashkillashtirishni ta'minlash
				majburiyatini oʻz zimmasiga oladi, «BUYURTMACHI» esa mazkur shartnoma shartlarida Maxsulotga toʻlov
				amalga oshirish va qabul qilib olish majburiyatini oʻz zimmasiga oladi. Maxsulot aniq
				markasi,</span><span style="font-family:Cambria">&#xa0; </span><span style="font-family:Cambria">miqdori
				va narxi mazkur shartnomaning 2.1-bandida koʻrsatilgan spesifikasiyada keltirilgan. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">1.2 «BUYURTMACHI» mazkur Shartnomani imzolashda Ishlab chiqaruvchiga
				bogʻliq boʻlmagan holda jaxonda kuzatilayotgan global muammolari sababli, ishlab chiqarishda vaqtincha
				uzilishlar vujudga kelganda, mahsulotni etkazib berish muddati Shartnomaning 3-moddasida Ishlab
				chiqaruvchi tomonidan belgilangan yetkazib berish muddatiga roziligini bildiradi. «BUYURTMACHI» makzur
				Shartnomani 2.4.1-bandini istisno etgan holda, muddatidan oldin Shartnomani bekor qilishi mumkin, bunda
				Ishlab chiqaruvchi 10 (oʻn) kalendar kuni oldin yozma xabarnoma yuborish yoʻli bilan ogohlantirishi,
				ogohlantirishdan soʻng, 10 (oʻn) kalendar kuni ichida toʻlov qilingan soʻmmani toʻliq qaytarib olishga
				haqli hisoblanadi. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">1.3. Etkazib beriladigan maxsulot O’zDST andozalaridan to’liq utgan.
			</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">2. MAHSULOTNING NARXI VA TOʻLASH TARTIBI</span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">2.1 Maxsulot aniq markasi, miqdori, yetkazib berish xizmati yokida yetkazib berish xizmatisiz
				va narxi qiymatining summasi quyidagi spesifikasiyada aniqlanadi:</span>
		</p>
		<table style="
          width: 100%;
          margin-bottom: 0pt;
          border: 0.75pt solid #000000;
          border-collapse: collapse;
          margin-top: 20px;
          margin-bottom: 20px;
        ">
			<tr style="height: 44.55pt">
				<td style="
              width: 19.5pt;
              border-right: 0.75pt solid #000000;
              border-bottom: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<h1 style="
                margin-top: 0pt;
                text-align: center;
                line-height: 115%;
                font-size: 8pt;
              ">
						<span style="
                  font-family: Cambria;
                  font-weight: normal;
                  color: #000000;
                ">№</span>
					</h1>
				</td>
				<td style="
              width: 86.25pt;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              border-bottom: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<h1 style="
                margin-top: 0pt;
                text-align: center;
                line-height: 115%;
                font-size: 8pt;
              ">
						<span style="
                  font-family: Cambria;
                  font-weight: normal;
                  color: #000000;
                ">Mahsulot nomi</span>
					</h1>
				</td>
				<td style="
              width: 53pt;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              border-bottom: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<h1 style="
                margin-top: 0pt;
                text-align: center;
                line-height: 115%;
                font-size: 8pt;
              ">
						<span style="
                  font-family: Cambria;
                  font-weight: normal;
                  color: #000000;
                ">O‘lchov birligi</span>
					</h1>
				</td>
				<td style="
              width: 52.95pt;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              border-bottom: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<h1 style="
                margin-top: 0pt;
                text-align: center;
                line-height: 115%;
                font-size: 8pt;
              ">
						<span style="
                  font-family: Cambria;
                  font-weight: normal;
                  color: #000000;
                ">Qancha miqdorda</span>
					</h1>
				</td>
				<td style="
              width: 53pt;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              border-bottom: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<h1 style="
                margin-top: 0pt;
                text-align: center;
                line-height: 115%;
                font-size: 8pt;
              ">
						<span style="
                  font-family: Cambria;
                  font-weight: normal;
                  color: #000000;
                ">Narxi</span>
					</h1>
					<h1 style="
                margin-top: 0pt;
                text-align: center;
                line-height: 115%;
                font-size: 8pt;
              ">
						<span style="
                  font-family: Cambria;
                  font-weight: normal;
                  color: #000000;
                ">(qqs siz)</span>
					</h1>
				</td>
				${
          isDelivery
            ? `<td style="
              width: 53pt;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              border-bottom: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<h1 style="
                margin-top: 0pt;
                text-align: center;
                line-height: 115%;
                font-size: 8pt;
              ">
						<span style="
                  font-family: Cambria;
                  font-weight: normal;
                  color: #000000;
                ">Yetkazib berish xizmati bilan</span>
					</h1>
				</td>`
            : ""
        }

				<td style="
              width: 60.1pt;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              border-bottom: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<h1 style="
                margin-top: 0pt;
                text-align: center;
                line-height: 115%;
                font-size: 8pt;
              ">
						<span style="
                  font-family: Cambria;
                  font-weight: normal;
                  color: #000000;
                ">Summasi</span>
					</h1>
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria">(qqs siz) </span>
					</p>
				</td>
				<td style="
              width: 67.15pt;
              border-left: 0.75pt solid #000000;
              border-bottom: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<h1 style="
                margin-top: 0pt;
                text-align: center;
                line-height: 115%;
                font-size: 8pt;
              ">
						<span style="
                  font-family: Cambria;
                  font-weight: normal;
                  color: #000000;
                ">Mahsulot yetkazib berish muddati, oy, chorak, yil</span>
					</h1>
				</td>
			</tr>
			
			${products
        .map((product: any, index: number) => {
          return `
					<tr style="height: 14.65pt">
				<td style="
              width: 19.5pt;
              border-top: 0.75pt solid #000000;
              border-right: 0.75pt solid #000000;
              border-bottom: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria">${index + 1}</span>
					</p>
				</td>
				<td style="
              width: 86.25pt;
              border: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">${product.name_uz || "_?_"}</span>
					</p>
				</td>
				<td style="
              width: 53pt;
              border: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span
								style="font-family: Cambria;">${product.unit_uz || "_?_"}</span>
					</p>
				</td>
				<td style="
              width: 52.95pt;
              border: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">${product.qty || "_?_"}</span>
					</p>
				</td>
				<td style="
              width: 53pt;
              border: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">${
              formatNumber(
                product.discount !== 0 ? product.discount : product.price
              ) || "_?_"
            }</span>
					</p>
				</td>
				${
          isDelivery
            ? `
				<td style="
              width: 53pt;
              border: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">Kalkulyatsiya hisobi qo’shimcha ilova qilinadi</span>
					</p>
				</td>
				`
            : ""
        }
				<td style="
              width: 60.1pt;
              border: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">${formatNumber(
              product.qty *
                (product.discount !== 0 ? product.discount : product.price) || 0
            )}</span>
					</p>
				</td>
				<td style="
              width: 67.15pt;
              border-top: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              border-bottom: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">${
              data.deliveryDate || "_?_"
            } yilgacha</span>
					</p>
				</td>
			</tr>
				`;
        })
        .join("")}
			<tr style="height: 21.6pt">
				<td style="
              width: 19.5pt;
              border-top: 0.75pt solid #000000;
              border-right: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria">&#xa0;</span>	
					</p>
				</td>

				<td style="
              width: 86.25pt;
              border-top: 0.75pt solid #000000;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria">Jami</span>
					</p>
				</td>
				<td style="
              width: 53pt;
              border-top: 0.75pt solid #000000;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria">&#xa0;</span>
					</p>
				</td>
				<td style="
              width: 52.95pt;
              border-top: 0.75pt solid #000000;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria">&#xa0;</span>
					</p>
				</td>
				<td style="
              width: 53pt;
              border-top: 0.75pt solid #000000;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria">&#xa0;</span>
					</p>
				</td>
				${
          isDelivery
            ? `
				<td style="
              width: 53pt;
              border-top: 0.75pt solid #000000;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria">&#xa0;</span>
					</p>
				</td>
				`
            : ""
        }
				<td style="
              width: 60.1pt;
              border-top: 0.75pt solid #000000;
              border-right: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: bottom;
            ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">${formatNumber(
              Number(data.totalPrice)
            )}</span>
					</p>
				</td>
				<td style="
              width: 67.15pt;
              border-top: 0.75pt solid #000000;
              border-left: 0.75pt solid #000000;
              padding-right: 5.03pt;
              padding-left: 5.03pt;
              vertical-align: top;
            ">
					<p style="line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria">&#xa0;</span>
					</p>
				</td>
			</tr>
		</table>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">Mahsulotning umumiy narxi (QQS hisobga olinmaganda): </span>
			<strong>
			<span style="font-family:Cambria;">${data.writtenTotalPriceUz || "_?_"}</span>
			</strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">2.2 Maxsulot uchun hisob-kitoblar Oʻzbekiston Respublikasining milliy
				valyutasida (soʻmda) </span><strong><span style="font-family:Cambria; ">5-son JIEK xisob raqamiga
					20203000500425568012</span></strong><span style="font-family:Cambria">, ochilgan Agro bank Qiziltepa
				filiali hisob raqamiga </span><strong><span style="font-family:Cambria; ">(00212, STIR
					200016360)</span></strong><span style="font-family:Cambria"> quyidagi usullardan birida yoki ularni
				aralash shaklda qoʻllash yoʻli bilan amalga oshiriladi: </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">a) «MAHSULOT YETKAZIB BERUVCHI»ga xizmat koʻrsatuvchi tijorat bank
				kassalariga naqd pul mablagʻlarini topshirish va/yoki plastik kartochkasi orqali; </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">b) omonat (depozit) hisobvaraqlaridan va/yoki ssuda hisobvaraqlaridan pul
				mablagʻlarini oʻtkazish orqali; </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">v) mobil/internet banking toʻlov tizimlari va/yoki elektron to’lov tizimi
				orqali, shu jumladan «MUNIS» orqali.</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<strong><span style="font-family:Cambria; ">Maxsulot uchun toʻlovni amalga oshirilayotganda toʻlov
					topshiriqnomasida (kvitansiyada) shartnomaning tuzilgan sana va raqami, «BUYURTMACHI»ning familiya,
					ismi va otasining ismi, «BUYURTMACHI» pasport ma'lumotlari va JSHSHIR, mahsulot aniq narxidan iborat
					toʻlov maqsadlari toʻliq koʻrsatib oʻtilishi shart. </span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">2.3. «BUYURTMACHI»</span><span style="font-family:Cambria">&#xa0;
			</span><span style="font-family:Cambria">mazkur shartnoma tuzilgan kundan boshlab 7 (etti) kalendar kun
				ichida shartnomaning 2.1 bandida belgilangan Maxsulotning umumiy qiymatining 50% dan kam boʻlmagan
				miqdorda oldindan toʻlov amalga oshiradi. «BUYURTMACHI» oldindan toʻlovni amalga oshirgandan keyin bir
				kun ichida toʻlovni amalga oshirilganligini tasdiqlovchi hujjatni 5-son JIEKga taqdim etish
				majburiyatini oladi. «BUYURTMACHI» Maxsulot umumiy qiymatining qolgan summasini Maxsulotni yetkazib
				berishga 10 (oʻn) kalendar kuni qolganda amalga oshiradi.Oldidan toʻlovni toʻliq shaklda amalga
				oshirishga ruhsat etiladi. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<strong><span style="font-family:Cambria; ">«BUYURTMACHI» tomonidan toʻlovni amalga oshirish muddati va
					shartlari buzilgan taqdirda, mazkur shartnoma 5-son JIEK tomonidan bekor qilish toʻgʻrisida habardor
					etish majburiyatisiz bekor qilingan hisoblanadi.</span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">2.4 Foydalanishda xavfsizlikni ta'minlash, mahsulot sifati va
				takomillashuvini saqlash maqsadidi ishlab chiqaruvchi tomonidan Maxsulot narxiga ta'sir etishi mumkin
				boʻlgan qoʻshimchalar kiritishdan iborat Maxsulot miqdoriga yoki sifatiga qoʻshimcha oʻzgartirish
				kiritilishi mumkin. Qoʻshimcha narxiga va sifatiga bogʻliq ravishda Maxsulot narxi oʻzgargan taqdirda
				Xaridor oʻz xohishiga koʻra: </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">2.4.1. Maxsulot uchun toʻlangan toʻlov summani qaytarish sharti bilan
				Maxsulotni qabul qilishdan voz kechish; yoki kechmasligi</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">2.4.2. Qoʻshimcha shartnoma tuzish orqali Maxsulot qiymatidagi farqni
				toʻlashi; yoki to’lamasligi </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">2.4.3. Maxsulotni etkazib berilishi mumkin boʻlgan sifatli maxsulot turiga
				yoki miqdoriga</span><span style="font-family:Cambria">&#xa0; </span><span
				style="font-family:Cambria">almashtirishni talab qilish. Bunda «BUYURTMACHI»ga</span><span
				style="font-family:Cambria;"> </span><span style="font-family:Cambria">&#xa0;</span><span
				style="font-family:Cambria">yetkazib berilishi mumkin boʻlgan boshqa sifatli mahsulot turiga yoki
				miqdoridagi Maxsulotni almashtirishni koʻzda tutgan qoʻshimcha shartnomani imzolash, Maxsulot qiymati
				oshgan taqdirda uning qiymatini qoʻshimcha toʻlash majburiyatini oladi. Agar oʻrniga beriladigan
				Maxsulot qiymati mazkur shartnomada koʻzda tutilgan Maxsulot qiymatidan past boʻlsa, summa farqi
				Xaridorga qoʻshimcha shartnoma imzolangan kundan boshlab 30 (oʻttiz) kalendar kuni ichida
				qaytariladi.</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">3. MAXSULOTNI YETKAZIB BERISH MUDDATI VA TOPSHIRISH
					SHARTLARI</span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">3.1 «BUYURTMACHI» tomonidan mazkur shartnomaning 2.2-bandida koʻrsatilgan
				muddatdagi toʻlov shartiga qat'iy amal qilingan holatda, shuningdek, mazkur shartnomaning 1.2 bandida
				nazarda tutilgan ishlab chiqaruvchiga bogʻliq boʻlmagan holda ishlab chiqarishning vaqtincha uzilishlari
				yuz bermagan taqdirda, Maxsulotni etkazib berish </span>
			<strong><span
					style="font-family:Cambria;">${
            data.contractEndDate || "_?_"
          } yilgacha</span></strong>
					<span
				style="font-family:Cambria;"> </span><span style="font-family:Cambria">amal qiladi.</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">&#xa0;</span><span style="font-family:Cambria">3.1.1. Shu bilan birga,
				Tomonlar ishlab chiqaruvchiga bogʻliq boʻlmagan holda ishlab chiqarishning vaqtincha uzilishlari yuz
				bergan taqdirda maxsulotni etkazib berish muddati mazkur shartnomaning 3.1-bandida koʻrsatilgan
				muddatdan 45 kalendar kunigacha uzaytirilishi mumkinligini e'tirof etadilar va bunga oʻz roziliklarini
				bildiradilar. Qoʻshimcha uzaytirish muddati toʻgʻrisidagi ma'lumotlar ishlab chiqaruvchi
				«BUYURTMACHI»ning elektron pochta manziliga xabar beradi yoki 5-son JIEK tomonidan Xaridorga qoʻshimcha
				uzaytirilgan muddat toʻgʻrisidagi ma'lumotlar uning mazkur shartnomada koʻrsatib oʻtilgan manziliga
				yozma axborot yuborish orqali amalga oshiriladi. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">3.2. Maxsulotni yetkazib berilishining aniq sanasi «BUYURTMACHI»ga mazkur
				shartnomaning 3.1 bandida koʻrsatilgan Maxsulotni yetkazib berish muddatidan kamida 10 kun avval ma'lum
				qilinadi. 5-son JIEK omborida Maxsulot yetarli boʻlgan holatda, muddatidan ilgari etkazib berishi
				mumkin. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">3.3 Maxsulotni yetkazib berish 5-son JIEK tashqi hududidan
				tegishli</span><span style="font-family:Cambria">&#xa0; </span><span
				style="font-family:Cambria">tekshiruvlar asosida mustaqil olib ketish shartlarida amalga oshiriladi.
				</td>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">3.4 «BUYURTMACHI»</span><span style="font-family:Cambria">&#xa0;
			</span><span style="font-family:Cambria">tomonidan Maxsulotning sifati ,miqdori va boshqa ochiq-oydin
				kamchiliklariga nisbatan da'vo-e'tirozlar Maxsulotni yakuniy qabul qilib olingunga qadar uni tekshirish
				davrida 5-son JIEKga bildiriladi.Tomonlar kelishuviga asosan bartaraf etiladi.</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">4. TOMONLARNING HUQUQLARI VA MAJBURIYATLARI</span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">&#xa0;</span><span style="font-family:Cambria">4.1</span><span
				style="font-family:Cambria">&#xa0; </span><span style="font-family:Cambria">«MAHSULOT YETKAZIB
				BERUVCHI»ning majburiyatlari: </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.1.1. «MAHSULOT YETKAZIB BERUVCHI» mazkur shartnomaning 3.1 bandida
				koʻrsatilgan muddatlarning oʻzgarganligi haqida «BUYURTMACHI”ni telefon orqali xabardor qilishi, buni
				imkoniyati boʻlmaganda, elektron pochta, va boshqa usullar orqali xabar yuborishi; </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.1.2. «MAHSULOT YETKAZIB BERUVCHI»ning omborida Mahsulot yetarli
				bo’lganligi xaqida «BUYURTMACHI”ni telefon orqali xabardor qilish, elektron pochta, va boshqa usullar
				orqali xabar yuborishi hamda </span>
				${
          !isDelivery
            ? `<span style="font-family:Cambria;">«BUYURTMACHI”
				tomonida mahsulotni o’zi tomonidan olib ketilishi majburiyatini oladi. </span>`
            : `
				<span
				style="font-family:Cambria;">Shartnomada keltirilgan spesifikatsiyadagi hisoblangan
				kalkulyatsiya asosidagi to’lovni amalga oshirgan holda</span><span
				style="font-family:Cambria;">&#xa0; </span><span
				style="font-family:Cambria;">holda «MAHSULOT YETKAZIB BERUVCHI»ning avtomashinasida
				yetkazib berish amaliyotiga yo’l qo’yiladi (shartnomaga kalkulyatsiya hisobi ilova qilinadi)</span>
				`
        }
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">&#xa0;</span><span style="font-family:Cambria">4.1.3. Mazkur shartnomaning
				3.1-bandida belgilangan etkazib berish muddatida Mahsulot qiymatining 100 foiz toʻlovini amalga
				oshirilganligi sharti bilan </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.1.4. Mahsulotni oʻz omboridan tashqi hududga olib chiqgan
				holda</span><span style="font-family:Cambria">&#xa0; </span><span
				style="font-family:Cambria">«BUYURTMACHI”ga topshirish; Mahsulotni faqat «BUYURTMACHI” tomonidan unga
				tegishli Oʻzbekiston Respublikasi fuqarosining pasporti yoki Oʻzbekiston Respublikasining pasport
				tizimiga muvofiq uning oʻrnini bosuvchi boshqa hujjat taqdim etilgan xolatda topshirish; Mahsulotni
				«BUYURTMACHI”ga topshirish vaqtigacha uning sotuv oldi tayyorgarligini amalga oshirish; Mahsulotni
				«BUYURTMACHI”ga toʻliq sifat va miqdorda mazkur shartnoma shartlariga muvofiq biror-bir nuqson va
				kamchiliklarsiz topshirish; «BUYURTMACHI”ga hisob-faktura hamda hisob-ma'lumotnoma, </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.2 5-son JIEKning huquqlari: </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.2.1 «BUYURTMACHI” tomonidan ushbu shartnomaning 4.4.5-bandi shartlari
				buzilgan holatlar kuzatilgan taqdirda, «MAHSULOT YETKAZIB BERUVCHI» mahsulotni navbat tartibi asosida
				keyingi mijozga berish huquqiga ega. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.3 «BUYURTMACHI”ning huquqlari: Maxsulotni «BUYURTMACHI” tomonidan toʻliq
				qabul qilib olgunga qadar sifat va miqdor jihatdan to’liq emasligi va boshqa ochiq oydin kamchiliklari
				aniqlangan taqdirda ushbu kamchiliklarni 5-son JIEKga 7 kunlik muddatda bartaraf etish talabi bilan
				Maxsulotni qabul qilishdan bosh tortish. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.4 «BUYURTMACHI”ning majburiyatlari: </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.4.1. Mazkur shartnomaning 2.2 va 2.3 bandlari shartlari va muddatlariga
				muvofiq Maxsulotning toʻliq qiymati toʻlovini amalga oshirish; </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.4.2. Maxsulotni kabul qilib olish paytida 5-son JIEKning mas'ul shaxsiga
				oʻziga tegishli Oʻzbekiston Respublikasi fuqarosining amaldagi pasporti yoki Oʻzbekiston
				Respublikasining pasport tizimiga muvofiq uning oʻrnini bosuvchi boshqa hujjatni taqdim etish.</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.4.3. Mazkur shartnomaga muvofiq Maxsulotni sifati va miqdori boʻyicha
				qabul qilib olish; </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">4.4.5. «BUYURTMACHI”, 5-son JIEK tomonidan yoki elektron platformalar
				(“savdo5jiek.uz” internet platformasi) orqali mahsulotning 5-son JIEKning markaziy omborida mavjud
				ekanligidan xabardor boʻlganidan soʻng, mahsulot qiymatining 100% toʻlovini amalga oshirgan holda, 5
				(besh) ish kuni ichida qabul qilib, olib ketish majburiyatini oladi.</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">5. TOMONLARNING JAVOBGARLIGI</span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">&#xa0;</span><span style="font-family:Cambria">5.1 Maxsulotni yetkazib
				berish muddatlari buzilgan taqdirda, «BUYURTMACHI” 5-son JIEKdan har bir kechiktirilgan kun uchun
				Maxsulot qiymatining 0,02 foizi miqdorida jarima (penya) undirish huquqiga ega, biroq bunda jarima
				(penya)ning umumiy summasi Maxsulot qiymatining 50% foizi miqdoridan yuqori boʻlmasligi kerak. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">5.2.Mazkur Shartnomaning 3.1.1-bandida koʻzda tutilgan holatlar vujudga
				kelgan taqdirda, 5-son JIEK Maxsulot etkazib berish kechiktirilganligi uchun javobgarlikdan ozod
				etiladi. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">5.3. Maxsulot tegishli sifatga ega boʻlmay yoki miqdorga ega boʻlmagan
				holatda yetkazib berilgan taqdirda, mazkur shartnomada koʻzda tutilgan qoidalardan tashqari Tomonlar
				Oʻzbekiston Respublikasi Vazirlar Mahkamasining 13.02.2003 yildagi 75-sonli Qarori bilan tasdiqlangan
				“Oʻzbekiston Respublikasining Chakana savdo” Qoidalarining IX boʻlimiga amal qiladilar. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">5.4 O‘zbekiston Respublikasi «Xo‘jalik yurituvchi subyektlar faoliyatining
				shartnomaviy huquqiy bazasi» to‘g‘risidagi qonunning 10-moddasi, V-bobi hamda O‘zbekiston Respublikasi
				Fuqarolik Kodeksining 437-440 moddalari asosida tartibga keltirilgan</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">5.5. Ishlab chiqaruvchi tomonidan belgilangan foydalanish shartlari
				buzilgan va/yoki foydalanish shartlariga rioya qilinmagan taqdirda «BUYURTMACHI” sifatli xizmat olish
				huquqini yoʻqotadi.</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">6. FORS-MAJOR</span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">&#xa0;</span><span style="font-family:Cambria">6.1. Majburiyatlarning
				tegishlicha ijro etilmaganligi bartaraf etib boʻlmaydigan kuch oqibatida, ya'ni ayni sharoitlarda
				favqulodda va oldini olib boʻlmaydigan (fors-major) vaziyatlar natijasida yuz bergan taqdirda, Tomonlar
				javobgarlikdan ozod qilinadilar. Bunday vaziyatlar quyidagilarni oʻz ichiga oladi: tabiiy ofatlar,
				avariyalar, falokatlar, terrorchilik harakatlari, norozilik namoyishlari, urush harakatlari, davlat
				organlari qarorlari, ishlab chiqarishni toʻxtatilishi va mazkur shartnoma tomonlarning oqilona
				nazoratidan tashqari boshqa vaziyatlar. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">6.2. Fors-major vaziyatlari yuzaga kelgan taqdirda, fors-major
				vaziyatlariga uchragan Tomon bu toʻgʻrida ikkinchi Tomonni zudlik bilan, biroq eng koʻpi bilan 5 bank
				kuni mobaynida xabardor qiladi; bunda shartnomaning amal qilishi ushbu vaziyatlarning amal qilish
				muddatiga, biroq eng koʻpi bilan 3 oyga uzaytiriladi. Fors-major vaziyatlari yuzaga kelganligi
				toʻgʻrisida xabar olgan Tomon buning dalil-isbotlarini talab qilgan taqdirda, fors-major vaziyatlariga
				uchragan Tomon dalil-isbotlarni talab qilgan Tomonga vakolatli organlardan olingan tasdiqlovchi hujjatni
				taqdim qilishi shart. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">7. NIZOLARNI HAL QILISH TARTIBI</span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">7.1 Mazkur shartnomani tuzishda, bajarishda, oʻzgartirishda va bekor
				qilishda Tomonlar oʻrtasida da'volar yuzaga kelgan taqdirda, ular dastlab talabnomalar bildirish orqali
				koʻrib chiqiladi. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">7.2 Sud tartibigacha oʻzaro kelishuvga erishilmagan taqdirda nizolar 5-son
				JIEK ning joylashgan manzili boʻyicha sud tartibida hal qilinadi. </span>
		</p>
		<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:center; line-height:108%; font-size:8pt">
			<strong><span style="font-family:Cambria; ">8.</span></strong><span style="font-family:Cambria">
			</span><strong><span style="font-family:Cambria; ">KORRUPSIYAGA QARSHI
					QO</span></strong><strong>‘</strong><strong><span style="font-family:Cambria; ">ShIMChA
					ShARTLAR.</span></strong>
		</p>
		<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:justify; line-height:108%; font-size:8pt">
			<strong><span style="font-family:Cambria; ">8.1.</span></strong><span style="font-family:Cambria"> Taraflar
				shartnoma tuzishda, shartnomaning amal qilish muddatida va ushbu muddat tugaganidan so</span>‘<span
				style="font-family:Cambria">ng, shartnoma bilan bog</span>‘<span style="font-family:Cambria">liq
				korrupsiyaviy harakatlarni sodir qilmaslikka kelishib oladilar.</span>
		</p>
		<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:justify; line-height:108%; font-size:8pt">
			<strong><span style="font-family:Cambria; ">8.2.</span></strong><span style="font-family:Cambria"> Taraflar
				shartnomadagi korrupsiyaga qarshi qo</span>‘<span style="font-family:Cambria">shimcha shartlarda
				belgilangan korrupsiyaning oldini olish choralarini tan oladi va ularga rioya etilishi bo</span>‘<span
				style="font-family:Cambria">yicha hamkorlikni ta</span>’<span
				style="font-family:Cambria">minlaydilar.</span>
		</p>
		<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:justify; line-height:108%; font-size:8pt">
			<strong><span style="font-family:Cambria; ">8.3.</span></strong><span style="font-family:Cambria">&#xa0;
			</span><span style="font-family:Cambria">Har bir taraf shartnoma tuzilgan paytda bevosita o</span>‘<span
				style="font-family:Cambria">zi yoki uning ijroiya organlari, mansabdor shaxslari va xodimlari tomonidan
				shartnoma bilan bog</span>‘<span style="font-family:Cambria">liq munosabatlar yuzasidan qonunga xilof
				ravishda pul, moddiy olinishiga yo</span>‘<span style="font-family:Cambria">l qo</span>‘<span
				style="font-family:Cambria">yilmaganligini, taklif etilmaganligini, ularni berishga va</span>’<span
				style="font-family:Cambria">da qilinmaganligini, shuningdek moddiy yoki har qanday turdagi imtiyoz,
				ustunliklar olinmaganligini (kelajakda bu turdagi harakatlarni amalga oshirishi mumkinligi haqida
				taasurot qoldirilmaganligini) kafolatlaydi.</span>
		</p>
		<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:justify; line-height:108%; font-size:8pt">
			<strong><span style="font-family:Cambria; ">8.4.</span></strong><span style="font-family:Cambria"> Taraflar,
				ular tomonidan shartnoma doirasida jalb qilingan shaxslarning (yordamchi pudratchi tashkilotlar,
				agentlar taraflar nazorati ostidagi boshqa shaxslarning) yuqoridagi harakatlarni sodir etmasligi
				yuzasidan oqilona choralar ko</span>‘<span style="font-family:Cambria">riladi.</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">9. BOShQA HOLATLAR</span></strong>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">9.1 Mazkur shartnomada koʻrsatilmagan barcha holatlar amaldagi qonunchilik
				bilan tartibga solinadi. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">9.2 Mazkur shartnomaga kiritiladigan barcha oʻzgartirishlar va
				qoʻshimchalar yozma ravishda rasmiylashtirilgan va Tomonlarning vakolatli vakillari tomonidan imzolangan
				taqdirdagina qonuniy kuchga ega boʻladi. </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">9.3 Mazkur Shartnoma elektron raqamli imzo bilan imzolagandan soʻng yoki
				Tomonlar yozma ravishda imzolagandan soʻng, yuqorida ko</span>‘<span
				style="font-family:Cambria">rsatilgan sanadan boshlab qonuniy kuchga kiradi va Tomonlar shartnoma
				boʻyicha oʻz majburiyatlarini toʻliq bajargunga qadar amal qiladi, mazkur Shartnoma bilan nazarda
				tutilgan holatlar bundan mustasno.</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">9.4. Mazkur Shartnoma quyidagi holatlarda muddatidan oldin bekor qilinishi
				mumkin: </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">9.4.1.</span><span style="font-family:Cambria">&#xa0; </span><span
				style="font-family:Cambria">Tomonlarning oʻzaro roziligi boʻyicha; </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">9.4.2.</span><span style="font-family:Cambria">&#xa0; </span><span
				style="font-family:Cambria">Mazkur Shartnomaning 2.3 bandida koʻzda tutilgan holatda; </span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify">
			<span style="font-family:Cambria; font-size:8pt">9.4.3. 5-son JIEK ning </span><a
				href="http://www.savdo5jiek.uz" style="text-decoration:none"><span class="Hyperlink"
					style="font-family:Cambria; font-size:8pt">www.savdo5jiek.uz</span></a><span
				style="font-family:Cambria; font-size:8pt"> onlayn savdo platformasida Mijoz akkaunti orqali shartnoma
				oʻchirib tashlangan taqdirda shartnoma bekor hisoblanadi. 8.5 Mazkur shartnoma xar bir tomonlar uchun
				bir xil yuridik kuchga ega boʻlgan ikki nusxada, oʻzbek tilida kirill alifbosida tuzildi hamda elektron
				imzolar bilan imzolangan holda tuzildi.</span>
		</p>
		<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:justify; line-height:108%; font-size:8pt">
			<span style="font-family:Cambria">&#xa0;</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
			<span style="font-family:Cambria">&#xa0;</span>
		</p>
		<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
			<strong><span style="font-family:Cambria; ">10. TOMONLARNING MANZILLARI VA REKVIZITLARI</span></strong>
		</p>
		<div class="container">
			<div class="column">
				<h2>MAHSULOT YETKAZIB BERUVCHI</h2>
			<p><strong style="font-family:Cambria;">Nomi:</strong> ${
        admin.AdminInfo.company_name || "_?_"
      }</p>
				<p><strong style="font-family:Cambria;">Manzili:</strong> ${
          admin.AdminInfo.address || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">Tel:</strong> ${
          admin.AdminInfo.tel || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">STIR:</strong> ${
          admin.AdminInfo.inn || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">OKED:</strong> ${
          admin.AdminInfo.oked || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">X/r:</strong> ${
          admin.AdminInfo.x_r || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">Bank:</strong> ${
          admin.AdminInfo.bank || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">MFO:</strong> ${
          admin.AdminInfo.mfo || "_?_"
        }</p>
				<p class="noSpacing"><strong style="font-family:Cambria;">Rahbar:</strong> ${
          admin.AdminInfo.organizationLeader || "_?_"
        }</p>
			</div>
			<div class="column">
				<h2>BUYURTMACHI</h2>
				<p><strong style="font-family:Cambria;">Nomi:</strong> ${
          user.legal_info.name || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">Manzili:</strong> ${
          user.legal_info.address || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">Tel:</strong> ${
          user.legal_info.phone_number || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">STIR:</strong> ${
          user.legal_info.inn || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">OKED:</strong> ${
          user.legal_info.oked || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">X/r:</strong> ${
          user.legal_info.x_r || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">Bank:</strong> ${
          user.legal_info.bank || "_?_"
        }</p>
				<p><strong style="font-family:Cambria;">MFO:</strong> ${
          user.legal_info.mfo || "_?_"
        }</p>
				<p class="noSpacing"><strong style="font-family:Cambria;">Rahbar:</strong> ${user.first_name
          .charAt(0)
          .toUpperCase()}.${user.middle_name.charAt(0).toUpperCase()}.${
    user.sur_name.charAt(0).toUpperCase() + user.sur_name.slice(1).toLowerCase()
  }</p>
			</div>
		</div>
		<p>
			&#xa0;
		</p>
		<div style="clear:both">
			<p>
				&#xa0;
			</p>
		</div>
	</div>
</body>

</html>
    `;
}
