// Importa la libreria D3
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"


const datasetprova = await d3.csv("datasetprova.csv")

const height = 15300;
const marginLeft = 50;
const marginRight = 10;
const marginTop = 86.5;
const marginBottom = 50;
const marginBottomExtended = 250; // Per aumentare lo scroll in fondo
const width = window.innerWidth - marginLeft;

// Creazione di un elemento SVG
const svg = d3.create("svg")
.attr("height", height + marginBottomExtended)
.attr("width", width);

// Nuovo formato del minutaggio
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;
    return `${formattedHours}:${formattedMinutes}`;
}

// Creazione di una scala lineare da 0 a 120
const yScale = d3.scaleLinear()
.range([marginTop, height - marginBottom - marginBottomExtended])
.domain([0, 120])

// Creazione di una scala lineare basata sulla colonna "START" del dataset
const sScale = d3.scaleLinear()
.range([marginTop, height - marginBottom*57.7 - marginBottomExtended]) // Per far sì che rientri nella scala
.domain(d3.extent(datasetprova, d => d["START"]));

// Estrazione dei personaggi dalle colonne dalla 3 in poi
const personaggi = Object.keys(datasetprova[0]).slice(3)

// Creazione di una scala scaleBand basata sui personaggi
const xScale = d3.scaleBand()
.domain(personaggi)
.range([marginLeft, width - marginRight])
.padding(12)



// Seleziona tutti gli elementi "g" e associa loro i dati del dataset
const gruppi = svg.selectAll("g")
.data(datasetprova)
.join("g");



// Aggiungo l'asse a sinistra con sScale con i tick corrispondenti ai valori della scala (e quindi all'inizio della scena)
svg.append("g")
.attr("transform", "translate(" + marginLeft + " , 0)")
.call(d3.axisLeft(sScale)
.tickFormat(formatTime)
.tickValues(datasetprova.map(d => d["START"])))
.attr("class", "numbers")
.call((g) => g.select (".domain").remove());

// Aggiungo l'asse x e aggiusto le etichette
svg.append("g")
.attr("transform", "translate(0, " + marginTop + ")")
.call(d3.axisBottom(xScale).tickSize(0))
.call((g) => g.select (".domain").remove())
.selectAll("text")
.attr("text-anchor", "start")
.attr("display", "none")



// Estrazione dei colori dalla colonna "COLOR" del dataset
const colors = datasetprova.map(d => d["COLOR"]);

// Calcolo delle differenze tra i tempi di START consecutivi
const heightData = datasetprova.map((d, i, arr) => i < arr.length - 1 ? (arr[i + 1]["START"] - d["START"]) : 0);

// Selezione di tutti i div "luogo" dell'HTML
d3.select("body")
    .selectAll("div.luogo")
    .data(datasetprova)
    .join("div")
    .attr("class", "luogo")
    .style("height", (d, i, nodes) => i < nodes.length - 1 ? (sScale(heightData[i]) - 87) + "px" : sScale(heightData[i]) + "px")
    .style("width", (width - marginLeft - marginRight) + "px")
    .style("position", "absolute")
    .style("top", d => (sScale(d["START"]) + marginTop*17.25) + "px")  // Regola il valore top
    .style("left", marginLeft + "px")
    .style("background-color", (d, i) => colors[i]);

// Selezione di tutti i div "luogo-copia" dell'HTML (immagini)
d3.select("body")
    .selectAll("div.luogo-copia")
    .data(datasetprova)
    .join("div")
    .attr("class", "luogo-copia")
    .style("height", (d, i, nodes) => i < nodes.length - 1 ? (sScale(heightData[i]) - 87) + "px" : sScale(heightData[i]) + "px")
    .style("width", (width - marginLeft - marginRight) + "px")
    .style("position", "absolute")
    .style("top", d => (sScale(d["START"]) + marginTop*17.25) + "px")  // Regola il valore top
    .style("left", marginLeft + "px")
    .style("background-color", "none");

    

// Mappatura dei colori per personaggio
const colorMap = {
    STREGA: "#B792F8",
    AMOS_CALLOWAY: "#939393",
    JENNY: "#D77600",
    DON_PRICE: "#b3001a",
    SANDRA: "#F8E436",
    EDWARD: "#406C25",
    KARL: "#4F3E27",
    NORTHER_WINSLOW: "#e1bc77",
    JING_E_PING: "#9b223b",
    WILL: "#171c61",
    JOSEPHINE: "#e1c2c1"
};

// Aggiunta delle linee verticali per indicare la presenza di un personaggio
//datasetprova.columns.slice(3).forEach((personaggio) => {
//const isPresent = datasetprova.map(d => d[personaggio] === "P");
//const lineData = datasetprova.map((d, i) => ({
//    isPresent: isPresent[i],
//    start: d["START"],
//    nextStart: i < datasetprova.length - 1 ? datasetprova[i + 1]["START"] : height
//}));

  
//svg.selectAll(".line" + personaggio)
//  .data(lineData.filter(d => d.isPresent))
//  .enter()
//  .append("line")
//  .attr("class", "line" + personaggio)
//  .attr("x1", xScale(personaggio) + xScale.bandwidth() / 2)
//  .attr("x2", xScale(personaggio) + xScale.bandwidth() / 2)
//  .attr("y1", d => sScale(d.start))
//  .attr("y2", d => Math.min(sScale(d.nextStart), yScale.range()[1]))
//  .attr("stroke", colorMap[personaggio])
//  .attr("stroke-width", 4)
//  .style("z-index", 1)
//});


// Array di valori di "START" per i tick desiderati
const tickValues = [7, 9, 15, 19, 41, 46, 66, 67, 75, 82, 88, 92, 97, 101, 106, 119];

// Filtra i dati solo per i tick desiderati
const tickData = datasetprova.filter(d => tickValues.includes(+d["START"]));

// Aggiungi le linee bianche sfumate solo nei tick desiderati
//svg.selectAll(".cloud")
//  .data(tickData)
//  .enter()
//  .append("line")
//  .attr("class", "line")
//  .attr("x1", marginLeft)
//  .attr("x2", width - marginRight)
//  .attr("y1", d => sScale(d["START"]))
//  .attr("y2", d => sScale(d["START"]))
//  .style("stroke", "grey")
//  .style("stroke-width", 3)



// Return del nodo SVG
document.body.appendChild(svg.node());

// Array di testi da visualizzare
var texts = ["Edward pesca in un lago il pesce gatto pi&#249; grande del mondo, usando come esca la sua fede nuziale, riprendendola poi stritolando il pesce.",
            "",
            "Una notte Edward e i suoi amici si ritrovano fuori citt&#224; nei pressi della casa di una strega con un occhio di vetro, quando questi si ritrovano davanti la donna, guardano l&#8217;occhio e scoprono il modo in cui moriranno.",
            "",
            "Durante una messa, Edward scopre che i suoi muscoli e le sue ossa crescono troppo in fretta, cosa che lo porta a stare per tre anni a letto legato a macchinari, potendo solo consultare l&#8217;enciclopedia come mezzo di informazione.",
            "Edward si reca nella caverna dove vive un gigante di nome Karl che minaccia la citt&#224; di Ashton, a quel punto dopo una discussione entrambi decidono di andarsene insieme, verso nuovi orizzonti.",
            "Dopo essersi divisi, Edward prende un sentiero cupo, arrivando nell'adorabile cittadina di Spectre: qui conosce Norther Winslow, un poeta, e Jenny, una bambina che si innamora di lui.<br><br>Edward decide di non rimanere a Spectre, diventando il primo a farlo, per poi tornare in futuro, quando sar&#224; giusto farlo.",
            "Edward si smarrisce all&#8217;interno del bosco, ancor pi&#249; spaventoso di notte, trovandosi in un attimo tra le grinfie di alberi, che per&#242; lo rilasciano. Uscendo dalla foresta, Edward ritrova Karl, e insieme riprendono la strada.",
            "",
            "Edward e Karl arrivano al Callow Circus. Durante lo spettacolo, Edward vede una ragazza, della quale si innamora perdutamente a prima vista, ma non riesce a parlarci. Disperato, Edward chiede aiuto a Amos Calloway, il proprietario del circo, che si rivela amico di famiglia di questa ragazza. Amos dunque propone un lavoro non pagato ad Edward, dove la ricompensa &#232; un&#8217;informazione sulla ragazza una volta al mese.<br><br>Una notte, Edward scopre che Amos &#232; un lupo mannaro: quando si sveglia il giorno dopo, Amos, riconoscente per non avergli fatto del male, gli rivela il nome della ragazza, Sandra.",
            "Edward arriva al college dove studia Sandra con i suoi fiori preferiti e si dichiara a lei, ma scopre che quest&#8217;ultima &#232; gi&#224; promessa a Don Price, concittadino di Edward. Don Price scopre le intenzioni di Edward e lo picchia, ma ci&#242; si ritorce contro di lui: Sandra, infatti, notando la violenza del fidanzato, lo lascia per stare con Edward.",
            "",
            "Mentre si trova in ospedale dopo il litigio con Don Price, Edward scopre di dover partire alla volta del Vietnam per il servizio di leva militare obbligatoria.",
            "Edward si getta in una missione molto pericolosa per cercare di ridurre la sua permanenza nell&#8217;esercito e tornare a casa il prima possibile.",
            "Edward riesce a recuperare il materiale chiesto dall&#8217;esercito durante uno spettacolo di due gemelle siamesi, Jing e Ping, che per&#242; scoprono la missione.<br>Edward spiega loro che &#232; l&#236; per volere dell&#8217;esercito e che vorrebbe solo tornare a casa; le gemelle si commuovono e addirittura partono con lui.",
            "Sandra apprende la morte di Edward, in quanto l&#8217;esercito lo ha dato per disperso. Dopo quattro mesi, per&#242;, Edward riesce a tornare da Sandra.",
            "",
            "Dopo l&#8217;esperienza dell&#8217;esercito, Edward inizia a lavorare come rappresentante di commercio.",
            "Edward rincontra Norther Winslow nel bel mezzo di una rapina organizzata da quest&#8217;ultimo.<br><br>Dopo una chiacchierata, Norther decide di partire per Wall Street per cercare la fortuna.",
            "",
            "Una sera, tornando a casa, a causa di un temporale Edward finisce per caso a Spectre. Trovandola in fallimento, decide di comprarla per cinquantamila dollari. Non chiedeva soldi ai cittadini: voleva solo che la citt&#224; non morisse.<br><br>Qui Edward ritrova Jenny, ormai cresciuta e non pi&#249; bambina. Si propone di sistemare la sua casa, ma lei rifiuta. Edward decide di sistemarla lo stesso, grazie anche all&#8217;aiuto di Karl, creando un legame con Jenny.",
            "Jenny vorrebbe baciare Edward ma lui rifiuta, dicendo che &#232; innamorato di sua moglie. Jenny d&#224; a Edward l&#8217;atto di vendita della casa.",
            "",
            "Edward &#232; in punto di morte: Sandra, il figlio Will e la nuora Josephine lo portano via dall'ospedale.",
            "Tutti i personaggi delle storie sono riuniti per celebrare Edward e dargli l&#8217;ultimo saluto.",
            "",
            "Edward si trasforma in un pesce gatto e nuota via lontano."];

// Scrollama
var scrolly = document.querySelector("#scrolly");
var article = scrolly.querySelector("article");
var step = article.querySelectorAll(".luogo-copia");

// initialize the scrollama
var scroller = scrollama();

var activeIndex = null;

function updateTextContent(index) {
  const textContainer = d3.select("#text-container");

  // Aggiungi la transizione al text-container con ease-in-out
  textContainer.transition().duration(300).ease(d3.easeCubicInOut).style("opacity", 0);

  if (index < texts.length) {
    // Aspetta un breve momento prima di cambiare il testo e riportare l'opacità a 1
    setTimeout(() => {
      textContainer.html(texts[index])
                  .transition().duration(300).ease(d3.easeCubicInOut).style("opacity", 1);
    }, 300); // 500 millisecondi di attesa, puoi regolare questo valore
  }
}

let lastScrollDirection = null;

function handleStepEnter(response) {
  response.element.classList.add("is-active");

  const currentIndex = response.index;

  // Imposta l'opacità degli elementi .luogo a 1 solo per l'elemento corrente
  updateLuogoOpacity(currentIndex, 1);

  updateHtmlBackgroundColor(currentIndex);

  // Mostra le immagini corrispondenti allo step corrente
  showImagesForStep(currentIndex);

  // Aggiorna il contenuto del testo in base all'indice corrente
  updateTextContent(currentIndex);

  activeIndex = currentIndex;

  // Ripristina l'opacità del text-container quando si entra in uno degli step
  document.querySelector("#text-container").style.opacity = 1;
  document.querySelector(".button").style.opacity = 1;
  document.querySelector(".button").style.right = "30px";

  lastScrollDirection = response.direction;
}


function updateHtmlBackgroundColor(index) {
  const luogoElements = document.querySelectorAll(".luogo");
  if (index < luogoElements.length) {
      const currentLuogo = luogoElements[index];
      const backgroundColor = currentLuogo.classList.contains("reality") ? "#1d1d1d" : getComputedStyle(currentLuogo).backgroundColor;
      document.documentElement.style.backgroundColor = backgroundColor;
  }
}

// Funzione per impostare l'opacità; degli elementi .luogo
function updateLuogoOpacity(currentIndex, opacity) {
    const luogoElements = document.querySelectorAll(".luogo");
    luogoElements.forEach((element, index) => {
        element.style.opacity = (index === currentIndex) ? "1" : "0";
    });
}

function showImagesForStep(index) {
  // Imposta la visibilità delle immagini in base allo step corrente
  const imgEdward = document.querySelector("#img-edward");
  const imgStrega = document.querySelector("#img-strega");
  const imgSandra = document.querySelector("#img-sandra");
  const imgDonPrice = document.querySelector("#img-donprice");
  const imgJenny = document.querySelector("#img-jenny");
  const imgAmosCalloway = document.querySelector("#img-amoscalloway");
  const imgNortherWinslow = document.querySelector("#img-northerwinslow");
  const imgWill = document.querySelector("#img-will");
  const imgJosephine = document.querySelector("#img-josephine");
  const imgKarl = document.querySelector("#img-karl");
  const imgJingEPing = document.querySelector("#img-jingeping");
  
  const hoverEdward = document.querySelector("#edward-hover");
  const hoverStrega = document.querySelector("#strega-hover");
  const hoverSandra = document.querySelector("#sandra-hover");
  const hoverDonPrice = document.querySelector("#donprice-hover");
  const hoverJenny = document.querySelector("#jenny-hover");
  const hoverAmosCalloway = document.querySelector("#amoscalloway-hover");
  const hoverNortherWinslow = document.querySelector("#northerwinslow-hover");
  const hoverWill = document.querySelector("#will-hover");
  const hoverJosephine = document.querySelector("#josephine-hover");
  const hoverKarl = document.querySelector("#karl-hover");
  const hoverJingEPing = document.querySelector("#jingeping-hover");

  // Nascondi tutte le immagini con opacità 0
  const allImages = [imgEdward, imgStrega, imgSandra, imgDonPrice, imgJenny, imgAmosCalloway, imgNortherWinslow, imgWill, imgJosephine, imgKarl, imgJingEPing];
  allImages.forEach(img => {
    img.style.opacity = 0;
    img.style.left = "-99999px";
    img.style.filter = "drop-shadow(white 0 0 7px)"
  });

  const allHover = [hoverEdward, hoverStrega, hoverSandra, hoverDonPrice, hoverJenny, hoverAmosCalloway, hoverNortherWinslow, hoverWill, hoverJosephine, hoverKarl, hoverJingEPing];
  allHover.forEach(p => {
    p.style.left = "-99999px" // Per nascondere i nomi delle icone non presenti
  });

  // Mostra le immagini corrispondenti allo step corrente con opacità piena
  switch (index) {
    case 0:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      break;
    case 1:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgEdward.style.filter = "blur(4px)";
      break;
    case 2:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgStrega.style.opacity = 1;
      imgStrega.style.left = "-100px";
      hoverStrega.style.left = "-95px";
      imgDonPrice.style.opacity = 1;
      imgDonPrice.style.left = "40px";
      hoverDonPrice.style.left = "28px";
      break;
    case 3:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgEdward.style.filter = "blur(4px)"
      break;
    case 4:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgDonPrice.style.opacity = 1;
      imgDonPrice.style.left = "40px";
      hoverDonPrice.style.left = "28px";
      break;
    case 5:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgKarl.style.opacity = 1;
      imgKarl.style.left = "-80px";
      hoverKarl.style.left = "-70px";
      break;
    case 6:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgNortherWinslow.style.opacity = 1;
      imgNortherWinslow.style.left = "-100px";
      hoverNortherWinslow.style.left = "-150px";
      imgJenny.style.opacity = 1
      imgJenny.style.left = "40px";
      hoverJenny.style.left = "40px";
      break;
    case 7:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      break;
    case 8:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgEdward.style.filter = "blur(4px)"
      break;
    case 9:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgAmosCalloway.style.opacity = 1;
      imgAmosCalloway.style.left = "90px";
      hoverAmosCalloway.style.left = "60px";
      imgKarl.style.opacity = 1;
      imgKarl.style.left = "-80px";
      hoverKarl.style.left = "-70px";
      imgSandra.style.opacity = 1;
      imgSandra.style.left = "30px";
      hoverSandra.style.left = "30px";
      break;
    case 10:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgDonPrice.style.opacity = 1;
      imgDonPrice.style.left = "-90px";
      hoverDonPrice.style.left = "-105px";
      imgSandra.style.opacity = 1;
      imgSandra.style.left = "30px";
      hoverSandra.style.left = "30px";
      break;
    case 11:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgEdward.style.filter = "blur(4px)"
      break;
    case 12:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgSandra.style.opacity = 1;
      imgSandra.style.left = "30px";
      hoverSandra.style.left = "30px";
      break;
    case 13:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      break;
    case 14:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgJingEPing.style.opacity = 1;
      imgJingEPing.style.left = "-90px";
      hoverJingEPing.style.left = "-105px";
      break;
    case 15:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgSandra.style.opacity = 1;
      imgSandra.style.left = "30px";
      hoverSandra.style.left = "30px";
      break;
    case 16:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgEdward.style.filter = "blur(4px)"
      break;
    case 17:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      break;
    case 18:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgNortherWinslow.style.opacity = 1;
      imgNortherWinslow.style.left = "-90px";
      hoverNortherWinslow.style.left = "-140px";
      break;
    case 19:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgEdward.style.filter = "blur(4px)"
      break;
    case 20:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      break;
    case 21:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgJenny.style.opacity = 1;
      imgJenny.style.left = "40px";
      hoverJenny.style.left = "40px";
      imgKarl.style.opacity = 1;
      imgKarl.style.left = "-80px";
      hoverKarl.style.left = "-70px";
      break;
    case 22:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgEdward.style.filter = "blur(4px)"
      break;
    case 23:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgSandra.style.opacity = 1;
      imgSandra.style.left = "30px";
      hoverSandra.style.left = "30px";
      imgWill.style.opacity = 1;
      imgWill.style.left = "-75px";
      hoverWill.style.left = "-70px";
      imgJosephine.style.opacity = 1;
      imgJosephine.style.left = "-130px";
      hoverJosephine.style.left = "-140px";
      break;
    case 24:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgSandra.style.opacity = 1;
      imgSandra.style.left = "30px";
      hoverSandra.style.left = "30px";
      imgWill.style.opacity = 1;
      imgWill.style.left = "-75px";
      hoverWill.style.left = "-70px";
      imgJosephine.style.opacity = 1;
      imgJosephine.style.left = "-130px";
      hoverJosephine.style.left = "-140px";
      imgJenny.style.opacity = 1;
      imgJenny.style.left = "90px";
      hoverJenny.style.left = "90px";
      imgKarl.style.opacity = 1;
      imgKarl.style.left = "-170px";
      hoverKarl.style.left = "-160px";
      imgNortherWinslow.style.opacity = 1;
      imgNortherWinslow.style.left = "150px";
      hoverNortherWinslow.style.left = "100px";
      imgJingEPing.style.opacity = 1;
      imgJingEPing.style.left = "210px";
      hoverJingEPing.style.left = "200px";
      imgAmosCalloway.style.opacity = 1;
      imgAmosCalloway.style.left = "-240px";
      hoverAmosCalloway.style.left = "-270px";
      imgStrega.style.opacity = 1;
      imgStrega.style.left = "-310px";
      hoverStrega.style.left = "-310px";
      imgDonPrice.style.opacity = 1;
      imgDonPrice.style.left = "270px";
      hoverDonPrice.style.left = "260px";
      break;
    case 25:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      imgEdward.style.filter = "blur(4px)"
      break;
    case 26:
      imgEdward.style.opacity = 1;
      imgEdward.style.left = "-30px";
      hoverEdward.style.left = "-30px";
      break;
  }

}

const hoverTexts = document.querySelectorAll(".hover-text");

// Funzione per gestire l'evento di passaggio del mouse su un'icona
function handleIconMouseOver(iconId) {
  const correspondingText = document.querySelector(`#${iconId}-hover`);
  correspondingText.style.opacity = 1;
}

// Funzione per gestire l'evento di uscita del mouse da un'icona
function handleIconMouseOut(iconId) {
  const correspondingText = document.querySelector(`#${iconId}-hover`);
  correspondingText.style.opacity = 0;
}

// Aggiungi eventi di mouseover e mouseout a tutte le icone
const iconIds = ["edward", "strega", "sandra", "donprice", "jenny", "amoscalloway", "northerwinslow", "will", "josephine", "karl", "jingeping"];
iconIds.forEach((iconId) => {
  const icon = document.querySelector(`#img-${iconId}`);
  icon.addEventListener("mouseover", () => handleIconMouseOver(iconId));
  icon.addEventListener("mouseout", () => handleIconMouseOut(iconId));
});

function handleStepExit(response) {
  response.element.classList.remove("is-active");

  // Ripristina l'opacità degli elementi .luogo a 0 quando si esce dallo step
  updateLuogoOpacity(activeIndex, 0);

  if (activeIndex === response.index) {
    activeIndex = null;
  }

  const textContainer = document.querySelector("#text-container");
  const imgEdward = document.querySelector("#img-edward");
  const button = document.querySelector(".button");

  // Controlla se si sta uscendo verso l'alto dal primo step
  if (response.index === 0 && response.direction === "up") {
    document.documentElement.style.backgroundColor = ""; // Ripristina il colore di sfondo predefinito
    textContainer.style.opacity = 0;
    imgEdward.style.left = "-9999px"
    imgEdward.style.opacity = 0;
    button.style.opacity = 0
    button.style.right = "-9999px"
  }

  // Controlla se si sta uscendo verso il basso dall'ultimo step
  if (response.index === step.length - 1 && response.direction === "down") {
    document.documentElement.style.backgroundColor = "#1d1d1d";
    textContainer.style.opacity = 0;
    imgEdward.style.opacity = 0;
    button.style.opacity = 0
    button.style.right = "-9999px"
  }
}


function init() {
    scroller
        .setup({
            step: "#scrolly article .luogo-copia",
            debug: false,
            offset: 0.5
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);
}

// kick things off
init();


// Ottieni l'elemento dell'immagine freccia
var freccia = document.getElementById("freccia");

// Aggiungi un gestore di eventi per l'evento di scroll
window.addEventListener("scroll", function() {
    // Controlla la posizione di scroll
    var posizioneScroll = window.scrollY;

    // Imposta la visibilità in base alla posizione di scroll
    if (posizioneScroll > 150) {
        freccia.style.opacity = "0"; // Nascondi l'immagine
    } else {
        freccia.style.opacity = "1"; // Mostra l'immagine
    }
});
