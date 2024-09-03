import { AdminInfo, Administrator } from "../../../types/adminstrator.type";
import { ILegalInfo, IUser } from "../../../types/user.type";
import { formatNumber } from "../../../utils/numberToWords";

export default async function RuTshContractHtml(
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
			margin-top: 60pt;
		}
	</style>
</head>

<body>
<div style="float: right;">
		<img width="50" height="50" src="${data.qrcode}" alt"qr_code" >
	</div>
	<div style="margin-top: 20px;">
	<p class="NoSpacing" style="text-align:center; font-size:8pt">
		<strong><span style="font-family:Cambria; ">Договор публичной оферты с юридическими лицами по реализации
				продукции через Интернет</span></strong>
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
    } год</p>
		<p class="column" style="font-family:Cambria; width: auto; padding-right: 10px;">Кызылтепинский район</p>
	</div>
	<p class="NoSpacing" style="text-align:center">
		<strong><span style="font-family:Cambria; ">&#xa0;</span></strong>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">именуемый в тексте «ПОСТАВЩИК ПРОДУКЦИИ», начальник исправительной колонии № 5
			(далее – КИН), действующей на основании ее Положения, МАМАТНАЗАРОВ ЛАЗИЗБЕК ТУРАКУЛИЕВИЧ, с одной стороны,
			именуемый в дальнейшем «ЗАКАЗЧИК». "в тексте известно юридическое лицо, действующее на основании своего
			устава </span><strong><span style="font-family:Cambria;"> ${
        user.legal_info.name
      } </span></strong><span style="font-family:Cambria">с другой стороны, заключили настоящее соглашение
			о следующем:</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
		<a id="_Hlk172407251"><strong><span style="font-family:Cambria; ">1. Содержание договора</span></strong></a>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">1.1 «ПОСТАВЩИК ПРОДУКЦИИ» производится по настоящему договору.</span>
		<strong><span
			style="font-family:Cambria;"> ${
        data.productsCategoryRu || "_?_"
      } </span></strong><span
			style="font-family:Cambria">оформление заказа «ПОКУПАТЕЛЯ» на поставку продукции (далее «Товар») с
			производственного предприятия исправительной колонии № 5 (далее – КИН № 5) и направление ее «ПОКУПАТЕЛЮ» на
			основании счет-фактуру, и обязуется обеспечить организацию передачи в его распоряжение, а «ПОКУПАТЕЛЬ»
			обязуется произвести оплату и получить Товар на условиях настоящего договора. Точная марка, количество и
			цена товара указаны в спецификации, указанной в пункте 2.1 настоящего договора.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">1.2 «ПОКУПАТЕЛЬ» соглашается на срок поставки, указанный Производителем в
			статье 3 Соглашения, в случае временных перебоев в производстве из-за глобальных проблем, наблюдаемых в мире
			независимо от Производителя на момент подписания настоящего Соглашения. «ПОКУПАТЕЛЬ» может расторгнуть
			Соглашение досрочно, за исключением пункта 2.4.1, в этом случае Производитель направляет предварительное
			письменное уведомление за 10 (десять) календарных дней, оплачиваемое в течение 10 (десяти) календарных дней
			после уведомления. Полный возврат.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">1.3. Поставляемая продукция полностью соответствует стандартам УзДСТ.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<strong><span style="font-family:Cambria; ">2. ЦЕНА ТОВАРА И ПОРЯДОК ОПЛАТЫ</span></strong><span
			style="font-family:Cambria"> 2.1 Точная марка продукта, количество, служба доставки с доставкой или без нее,
			а также сумма стоимости определяются в следующей спецификации:</span>
	</p>
	<table style="
          width: 100%;
        margin-bottom: 0pt;
        border: 0.75pt solid #000000;
        border-collapse: collapse;
        margin-top: 20px;
        margin-bottom: 20px;
      ">
		<tr style="height: 46.3pt">
			<td style="
            width: 15.85pt;
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
					<span style="font-family: Cambria; font-weight: normal; color: #000000">Нет</span>
				</h1>
			</td>
			<td style="
            width: 74.65pt;
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
					<span style="font-family: Cambria; font-weight: normal; color: #000000">Наименование товара</span>
				</h1>
			</td>
			<td style="
            width: 45.35pt;
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
					<span style="font-family: Cambria; font-weight: normal; color: #000000">Единица измерения</span>
				</h1>
			</td>
			<td style="
            width: 45.35pt;
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
					<span style="font-family: Cambria; font-weight: normal; color: #000000">Сколько</span>
				</h1>
			</td>
			<td style="
            width: 45.35pt;
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
					<span style="font-family: Cambria; font-weight: normal; color: #000000">Расходы</span>
				</h1>
				<h1 style="
              margin-top: 0pt;
              text-align: center;
              line-height: 115%;
              font-size: 8pt;
            ">
					<span style="font-family: Cambria; font-weight: normal; color: #000000">(кто ты)</span>
				</h1>
			</td>
			${
        isDelivery
          ? `<td style="
            width: 45.35pt;
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
					<span style="font-family: Cambria; font-weight: normal; color: #000000">Со службой доставки</span>
				</h1>
			</td>
			`
          : ""
      }
			<td style="
            width: 51.65pt;
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
					<span style="font-family: Cambria; font-weight: normal; color: #000000">Количество</span>
				</h1>
				<p style="text-align: center; line-height: 108%; font-size: 8pt">
					<span style="font-family: Cambria">(кто ты)</span>
				</p>
			</td>
			<td style="
            width: 57.85pt;
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
					<span style="font-family: Cambria; font-weight: normal; color: #000000">Срок поставки продукции,
						месяц,
						квартал, год</span>
				</h1>
			</td>
		</tr>
		${products.map((product: any, index: number) => {
      return `
			<tr style="height: 15.2pt">
				<td style="
				width: 15.85pt;
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
				width: 74.65pt;
				border: 0.75pt solid #000000;
				padding-right: 5.03pt;
				padding-left: 5.03pt;
				vertical-align: top;
			  ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">${product.name_ru}</span>
					</p>
				</td>
				<td style="
				width: 45.35pt;
				border: 0.75pt solid #000000;
				padding-right: 5.03pt;
				padding-left: 5.03pt;
				vertical-align: top;
			  ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">${product.unit_ru || "_?_"}</span>
					</p>
				</td>
				<td style="
				width: 45.35pt;
				border: 0.75pt solid #000000;
				padding-right: 5.03pt;
				padding-left: 5.03pt;
				vertical-align: top;
			  ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">${product.qty || 0}</span>
					</p>
				</td>
				<td style="
				width: 45.35pt;
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
            ? `<td style="
			width: 45.35pt;
			border: 0.75pt solid #000000;
			padding-right: 5.03pt;
			padding-left: 5.03pt;
			vertical-align: top;
		  ">
				<p style="text-align: center; line-height: 108%; font-size: 8pt">
					<span style="font-family: Cambria;">За доставку вышлют дополнительный счет</span>
				</p>
			</td>
			`
            : ""
        }
				<td style="
				width: 51.65pt;
				border: 0.75pt solid #000000;
				padding-right: 5.03pt;
				padding-left: 5.03pt;
				vertical-align: top;
			  ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">${
              product.qty *
                (product.discount !== 0 ? product.discount : product.price) || 0
            }</span>
					</p>
				</td>
				<td style="
				width: 57.85pt;
				border-top: 0.75pt solid #000000;
				border-left: 0.75pt solid #000000;
				border-bottom: 0.75pt solid #000000;
				padding-right: 5.03pt;
				padding-left: 5.03pt;
				vertical-align: top;
			  ">
					<p style="text-align: center; line-height: 108%; font-size: 8pt">
						<span style="font-family: Cambria;">До ${data.deliveryDate || "_?_"}</span>
					</p>
				</td>
			</tr>			
			`;
    }).join("")}
		<tr style="height: 22.45pt">
			<td style="
            width: 15.85pt;
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
	  width: 51.65pt;
	  border-top: 0.75pt solid #000000;
	  border-right: 0.75pt solid #000000;
	  border-left: 0.75pt solid #000000;
	  padding-right: 5.03pt;
	  padding-left: 5.03pt;
	  vertical-align: bottom;
	">
				<p style="text-align: center; line-height: 108%; font-size: 8pt">
					<span style="font-family: Cambria;">Общий</span>
				</p>
			</td>
			<td style="
            width: 45.35pt;
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
            width: 45.35pt;
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
            width: 45.35pt;
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
            width: 45.35pt;
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
            width: 51.65pt;
            border-top: 0.75pt solid #000000;
            border-right: 0.75pt solid #000000;
            border-left: 0.75pt solid #000000;
            padding-right: 5.03pt;
            padding-left: 5.03pt;
            vertical-align: bottom;
          ">
				<p style="text-align: center; line-height: 108%; font-size: 8pt">
					<strong><span style="font-family: Cambria;">${formatNumber(
            Number(data.totalPrice) || 0
          )}</span></strong>
				</p>
			</td>
			<td style="
            width: 57.85pt;
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
			<span style="font-family:Cambria">Общая стоимость товара (без НДС):</span>
			<strong>
			<span style="font-family:Cambria;">${data.writtenTotalPriceRu || "_?_"}</span>
			</strong>
		</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">2.2 Оплата за продукцию осуществляется в национальной валюте Республики
			Узбекистан (в сумах) на номер счета КИН №5 20203000500425568012, на номер счета открытого филиала «Агробанк
			Кызылтепинский» (00212, СТИР 200016360) с использованием одного из следующие методы или их сочетание:</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">а) передачу наличных денег и/или пластиковой карты в кассы коммерческого
			банка, обслуживающего «ПОСТАВЩИКА ТОВАРА»;</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">б) путем перевода денежных средств со сберегательных (депозитных) счетов и
			(или) ссудных счетов;</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">v) через платежные системы мобильного/интернет-банкинга и/или систему
			электронных платежей, в том числе через «МУНИС».</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<strong><span style="font-family:Cambria; ">При осуществлении оплаты товара в платежном поручении (квитанции)
				должны быть указаны дата и номер договора, фамилия, имя и отчество «ПОКУПАТЕЛЯ», паспортные данные
				«ПОКУПАТЕЛЯ» и назначение платежа. , включая точную цену продукта.</span></strong>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">2.3. «ПОКУПАТЕЛЬ» обязан произвести предоплату в размере не менее 50% от общей
			стоимости Товара, указанного в пункте 2.1 Договора, в течение 7 (семи) календарных дней с даты заключения
			настоящего Договора. «ПОКУПАТЕЛЬ» обязуется предоставить документ, подтверждающий оплату, в КИН №5 в течение
			одного дня после внесения предоплаты. «ПОКУПАТЕЛЬ» оплачивает оставшуюся сумму от общей стоимости Товара за
			10 (десять) календарных дней до доставки Товара. Допускается оплата в полном объеме заранее.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<strong><span style="font-family:Cambria; ">В случае нарушения «ПОКУПАТЕЛЕМ» условий оплаты настоящий договор
				считается расторгнутым КИН №5 без обязательства уведомить о расторжении.</span></strong>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">2.4 В целях обеспечения безопасности в использовании, сохранения и улучшения
			качества Товара производитель может вносить дополнительные изменения в количество или качество Товара, что
			может повлиять на цену Товара. Если цена Товара изменится в связи с дополнительными затратами и качеством,
			Покупатель имеет право:</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">2.4.1. Отказ от приемки Товара при условии возврата уплаченной за Товар суммы;
			или нет</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">2.4.2. Оплата разницы в цене Товара путем заключения дополнительного договора;
			или неуплата</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">2.4.3. Запросите обмен товара на товар того же качества или количества,
			который может быть поставлен. В данном случае «ПОКУПАТЕЛЮ».</span><span
			style="font-family:Cambria;"> </span><span style="font-family:Cambria">Заключая дополнительный
			договор, предусматривающий замену Товара на другой качественный вид или количество товара, которое может
			быть поставлено, обязуется уплатить дополнительную цену в случае увеличения стоимости Товара. Если стоимость
			заменяемого Товара ниже стоимости Товара, указанной в настоящем договоре, разница в сумме будет возвращена
			Покупателю в течение 30 (тридцати) календарных дней с момента заключения дополнительного договора.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
		<strong><span style="font-family:Cambria; ">3. СРОКИ И УСЛОВИЯ ДОСТАВКИ ТОВАРА</span></strong>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">3.1 Доставка Товара в случае строгого соблюдения «ПОКУПАТЕЛЕМ» условий оплаты,
			указанных в пункте 2.2 настоящего Договора, а также в случае отсутствия временных, независимых от
			производителя, перерывов в производстве, предусмотренных п. Пункт 1.2 настоящего
			Соглашения</span><strong><span style="font-family:Cambria;"> До ${
        data.contractEndDate || "_?_"
      }
				г.</span></strong><span style="font-family:Cambria;"> </span><span
			style="font-family:Cambria">применяется.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">3.1.1. При этом Стороны признают и соглашаются, что в случае временных
			перерывов производства, не зависящих от производителя, срок поставки продукции может быть продлен до 45
			календарных дней от срока, указанного в пункте 3.1 настоящего договора. Информация о дополнительном сроке
			продления будет отправлена ​​производителем на адрес электронной почты «ПОКУПАТЕЛЯ» или КИН №5
			проинформирует Покупателя о дополнительном продлении срока путем направления письменной информации на адрес,
			указанный в настоящем договоре.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">3.2. Точная дата поставки товара будет сообщена «ПОКУПАТЕЛЮ» не позднее, чем
			за 10 дней до даты поставки товара, указанной в пункте 3.1 настоящего договора. №5 На складе КИН товар может
			быть доставлен раньше срока, если его имеется достаточное количество.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">3.3 Доставка товара осуществляется на условиях самовывоза с внешней территории
			КИН №5, на основании соответствующих проверок.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">3.4 Жалобы «ПОКУПАТЕЛЯ» относительно качества, количества и других очевидных
			дефектов Продукта должны быть сообщены в КИН № 5 в течение периода проверки до окончательной приемки
			Продукта.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
		<strong><span style="font-family:Cambria; ">4. ПРАВА И ОБЯЗАННОСТИ СТОРОН</span></strong>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.1 Обязанности «ПОСТАВЩИКА ТОВАРА»:</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.1.1. «ПОСТАВЩИК ТОВАРА» обязан информировать «ПОТРЕБИТЕЛЯ» об изменении
			условий, указанных в пункте 3.1 настоящего договора, по телефону, а при невозможности – по электронной почте
			и другими способами;</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.1.2. Уведомить ЗАКАЗЧИКА по телефону, электронной почте и другими способами
			о наличии Товара на складе «ПОСТАВЩИКА ПРОДУКЦИИ» и</span>
			${
        !isDelivery
          ? `
			<span
			style="font-family:Cambria;">«ПОКУПАТЕЛЬ» обязуется забрать товар самостоятельно.</span>
			`
          : `
				<span
				style="font-family:Cambria;">Допускается практика доставки автотранспортом «ПОСТАВЩИКА ТОВАРА»
				с оплатой по расчетному расчету, указанному в договоре (к договору прилагается расчет).</span>
				`
      }
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.1.3. При условии оплаты 100% стоимости Товара в течение срока поставки,
			указанного в пункте 3.1 настоящего Договора.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.1.4. Доставка товара со склада «ПОКУПАТЕЛЮ»; Доставка товара только в случае
			предъявления «ПОКУПАТЕЛЕМ» паспорта гражданина Республики Узбекистан или иного документа, заменяющего его в
			соответствии с паспортной системой Республики Узбекистан; Предпродажная подготовка товара до момента его
			доставки «ПОКУПАТЕЛЮ»; Доставка товара «ПОКУПАТЕЛЮ» в полном качестве и количестве в соответствии с
			условиями настоящего договора, без каких-либо дефектов и недостатков; Счет-фактура и выписка по счету
			«ПОКУПАТЕЛЕМ»,</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.2 Права КИН №5:</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.2.1 В случае нарушения «ПОКУПАТЕЛЕМ» пункта 4.4.5 настоящего договора,
			«ПОСТАВЩИК ТОВАРА» имеет право передать товар следующему покупателю в порядке очереди.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.3 Права «ПОКУПАТЕЛЯ»: Отказ от приемки Товара с требованием устранения
			указанных недостатков в течение 7 дней по КИН №5 в случае наличия некомплектности по качеству и количеству и
			других очевидных недостатков до момента полной приемки Товара Покупателем. «ПОКУПАТЕЛЬ».</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.4 Обязанности «ПОКУПАТЕЛЯ»:</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.4.1. Оплата полной стоимости Товара в соответствии с условиями пунктов 2.2 и
			2.3 настоящего Соглашения;</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.4.2. При приемке продукции ответственное лицо КИН №5 должно предъявить
			действующий паспорт гражданина Республики Узбекистан или иной документ, заменяющий его в соответствии с
			паспортной системой Республики Узбекистан.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.4.3. Приемка Товара по качеству и количеству в соответствии с настоящим
			договором;</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">4.4.5. В течение 5 (пяти) рабочих дней после того, как «ПОКУПАТЕЛЮ» станет
			известно о наличии товара на центральном складе КИН №5 через КИН №5 или через электронные площадки
			(интернет-платформа «savdo5jiek.uz»), при оплате 100% стоимости товара обязуется принять и забрать.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
		<strong><span style="font-family:Cambria; ">5. ОТВЕТСТВЕННОСТЬ СТОРОН</span></strong>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">5.1 В случае нарушения сроков поставки Товара «ПОКУПАТЕЛЬ» имеет право
			взыскать с КИН №5 штраф (пеню) в размере 0,02% от стоимости Товара за каждый день просрочки, но общую сумму
			Штраф (штраф) составляет 50% от стоимости Товара, не должен быть высоким.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">5.2. При возникновении обстоятельств, предусмотренных пунктом 3.1.1 настоящего
			Соглашения, ИЭК №5 освобождается от ответственности за задержку доставки Товара.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">5.3. В случае поставки товара не соответствующего качества или количества,
			помимо условий, предусмотренных настоящим договором, Стороны обязаны соблюдать раздел IX Правил «Розничной
			торговли Республики Узбекистан», утвержденных Постановлением № 75 от Постановление Кабинета Министров
			Республики Узбекистан от 13.02.2003.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">5.4 Регулируется на основании статьи 10 главы V Закона Республики Узбекистан
			«О договорно-правовой основе деятельности субъектов предпринимательства» и статей 437-440 Гражданского
			кодекса Республики Узбекистан.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">5.5. В случае нарушения установленных производителем условий использования
			и/или несоблюдения условий использования «ПОКУПАТЕЛЬ» теряет право на получение качественного
			сервиса.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
		<strong><span style="font-family:Cambria; ">6. БОЛЬШИЕ СИЛЫ</span></strong>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">6.1. Стороны освобождаются от ответственности в случае неисполнения
			обязательств вследствие обстоятельств непреодолимой силы, то есть вследствие возникновения чрезвычайных и
			непредотвратимых (форс-мажорных) обстоятельств при тех же обстоятельствах. К таким ситуациям относятся:
			стихийные бедствия, аварии, катастрофы, террористические акты, протесты, военные действия, решения органов
			государственной власти, приостановка производства и другие ситуации, находящиеся вне разумного контроля
			сторон настоящего контракта.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">6.2. В случае возникновения обстоятельств непреодолимой силы Сторона,
			подвергшаяся наступлению обстоятельств непреодолимой силы, обязана немедленно, но не позднее, чем в течение
			5 банковских дней, уведомить об этом другую Сторону; в этом случае действие договора продлевается на период
			действия данных ситуаций, но максимум на 3 месяца. В случае, если Сторона, получающая информацию о
			возникновении обстоятельств непреодолимой силы, запрашивает доказательства этого, Сторона, в которой
			возникли обстоятельства непреодолимой силы, обязана предоставить Стороне, запрашивающей доказательства,
			подтверждающий документ, полученный от компетентных органов.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
		<strong><span style="font-family:Cambria; ">7. ПОРЯДОК РАЗРЕШЕНИЯ СПОРОВ</span></strong>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">7.1 В случае возникновения претензий между Сторонами в ходе заключения,
			исполнения, изменения и расторжения настоящего Соглашения, они рассматриваются путем подачи
			заявлений.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">7.2 В случае недостижения взаимного согласия до судебного разбирательства
			споры разрешаются в судебном порядке по адресу КИН №5.</span>
	</p>
	<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:center; line-height:108%; font-size:8pt">
		<a id="_Hlk172406227"><strong><span style="font-family:Cambria; ">8.</span></strong><span
				style="font-family:Cambria"> </span><strong><span style="font-family:Cambria; ">ДОПОЛНИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
					ПРОТИВ КОРРУПЦИИ.</span></strong></a>
	</p>
	<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:center; line-height:108%; font-size:8pt">
		<span style="font-family:Cambria">&#xa0;</span>
	</p>
	<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:justify; line-height:108%; font-size:8pt">
		<strong><span style="font-family:Cambria; ">8.1.</span></strong><span style="font-family:Cambria">Стороны
			обязуются не совершать коррупционных действий, связанных с договором, в период заключения договора, в
			течение срока действия договора и после истечения этого срока.</span>
	</p>
	<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:justify; line-height:108%; font-size:8pt">
		<strong><span style="font-family:Cambria; ">8.2.</span></strong><span style="font-family:Cambria">Стороны
			признают антикоррупционные меры, предусмотренные дополнительными антикоррупционными положениями соглашения,
			и обеспечивают сотрудничество в их соблюдении.</span>
	</p>
	<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:justify; line-height:108%; font-size:8pt">
		<strong><span style="font-family:Cambria; ">8.3.</span></strong><span style="font-family:Cambria">При заключении
			договора каждая сторона заявляет, что ей или его исполнительным органам, должностным лицам и работникам не
			разрешалось, не предлагалось и не обещалось незаконно получить деньги или материалы в связи с отношениями,
			связанными с договором. а также гарантирует, что никакие материальные или какие-либо выгоды, преимущества не
			были получены (и не осталось впечатления, что такие действия могут быть осуществлены в будущем).</span>
	</p>
	<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:justify; line-height:108%; font-size:8pt">
		<strong><span style="font-family:Cambria; ">8.4.</span></strong><span style="font-family:Cambria">Стороны
			обязаны принять разумные меры для обеспечения того, чтобы лица, привлеченные ими в рамках договора
			(субподрядные организации, агенты и иные лица, находящиеся под контролем сторон), не совершали вышеуказанных
			действий.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
		<strong><span style="font-family:Cambria; ">9. ПРОЧИЕ ОБСТОЯТЕЛЬСТВА</span></strong>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">9.1 Все случаи, не указанные в настоящем договоре, регулируются действующим
			законодательством.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">9.2 Все изменения и дополнения к настоящему Соглашению имеют юридическую силу
			только в том случае, если они совершены в письменной форме и подписаны уполномоченными представителями
			Сторон.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">9.3 Настоящее Соглашение вступает в юридическую силу в указанную выше дату
			после подписания электронно-цифровой подписью или письменной подписи Сторон и действует до полного
			исполнения Сторонами своих обязательств по Соглашению, за исключением случаев, предусмотренных настоящим
			Соглашением. Соглашение.</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">9.4. Настоящее Соглашение может быть расторгнуто досрочно в следующих
			случаях:</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">9.4.1. По обоюдному согласию сторон;</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">9.4.2. В случае, предусмотренном пунктом 2.3 настоящего Соглашения;</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify">
		<span style="font-family:Cambria; font-size:8pt">9.4.3. №5 КИН</span> <a href="http://www.savdo5jiek.uz"
			style="text-decoration:none"><span class="Hyperlink"
				style="font-family:Cambria; font-size:8pt">www.savdo5jiek.uz</span></a><span class="Hyperlink"
			style="font-family:Cambria; font-size:8pt"> </span><span style="font-family:Cambria; font-size:8pt">договор
			считается недействительным в случае его удаления через учетную запись Клиента на торговой онлайн-платформе.
			8.5 Настоящий договор составлен на русском языке в двух экземплярах, имеющих одинаковую юридическую силу для
			каждой стороны, и подписан электронными подписями.</span>
	</p>
	<p style="margin-bottom:0pt; text-indent:35.4pt; text-align:justify; line-height:108%; font-size:8pt">
		<span style="font-family:Cambria">&#xa0;</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:justify; font-size:8pt">
		<span style="font-family:Cambria">&#xa0;</span>
	</p>
	<p class="NoSpacing" style="text-indent:35.4pt; text-align:center; font-size:8pt">
		<strong><span style="font-family:Cambria; ">10. АДРЕСА И РЕКВИЗИТЫ СТОРОН</span></strong>
	</p>
	<div class="container">
		<div class="column">
			<h2>ПОСТАВЩИК</h2>
			<p><strong style="font-family:Cambria;">Название:</strong>${
        admin.AdminInfo.company_name || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">Адрес:</strong> ${
        admin.AdminInfo.address || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">Тел:</strong> ${
        admin.AdminInfo.tel || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">ИНН:</strong> ${
        admin.AdminInfo.inn || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">ОКЭД:</strong> ${
        admin.AdminInfo.oked || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">Р/с:</strong>${
        admin.AdminInfo.x_r || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">Банк:</strong> ${
        admin.AdminInfo.bank || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">МФО:</strong> ${
        admin.AdminInfo.mfo || "_?_"
      }</p>
			<p class="noSpacing"><strong style=	"font-family:Cambria;">Руководитель:</strong> ${
        admin.AdminInfo.organizationLeader || "_?_"
      }</p>
		</div>
		<div class="column">
			<h2>ЗАКАЗЧИК</h2>
			<p><strong style="font-family:Cambria;">Название:</strong>${
        user.legal_info.name || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">Адрес:</strong> ${
        user.legal_info.address || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">Тел:</strong> ${
        user.legal_info.phone_number || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">ИНН:</strong> ${
        user.legal_info.inn || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">ОКЭД:</strong> ${
        user.legal_info.oked || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">Р/с:</strong> ${
        user.legal_info.x_r || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">Банк:</strong> ${
        user.legal_info.bank || "_?_"
      }</p>
			<p><strong style="font-family:Cambria;">МФО:</strong> ${
        user.legal_info.mfo || "_?_"
      }</p>
			<p class="noSpacing"><strong style="font-family:Cambria;">Руководитель:</strong> ${user.first_name
        .charAt(0)
        .toUpperCase()}.${user.middle_name.charAt(0).toUpperCase()}.${
    user.sur_name.charAt(0).toUpperCase() + user.sur_name.slice(1).toLowerCase()
  }</p>
		</div>
	</div>
	</div>
</body>

</html>
    `;
}
