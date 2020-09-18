# Specyfikacja adaptacji HTML

## Metadane

W elemencie `head` dokumentu HTML należy uzupełnić informacje na jego temat.

```html
<meta name="author" content="Magdalena Kruczek" />
  <title>Specyfikacja adaptacji HTML</title>
```

W sekcji `header` dokumentu HTML należy uzupełnić tytuł oznaczony nagłówkiem pierwszego stopnia.

```html
<header>
<h1>Specyfikacja adaptacji HTML</h1>
</header>
```

## Nagłówki

Ważne jest oznaczanie nagłówków w dokumencie - przez nie zostanie stworzony spis treści za pomocą skryptu .js. Nagłówek poziomu pierwszego zwyczajowo przypisywany jest do tytułu publikacji, rozdziały rozpoczynamy numerować od nagłówka poziomu drugiego. Należy zachować hierarchię nagłówków. Nie należy używać nagłówka poziomu trzeciego jeśli wcześniej w dokumencie nie został użyty nagłówek poziomu drugiego.

**Przykład poprawnie użytej struktury nagłówków:**

Tytuł dokumentu (Nagłówek 1)

​		Rozdział 1. (Nagłówek 2)

​			Podrozdział 1.1. (Nagłówek 3)

​			Podrozdział 1.2. (Nagłówek 3)

​				Podrozdział 1.2.1. (Nagłówek 4)

​		Rozdział 2. (Nagłówek 2) 

## Tabele

Tabele możemy utworzyć za pomocą generatora tabel [Przejdź do generatora tabel](https://www.tablesgenerator.com/html_tables). Tabele powinny posiadać wiersz nagłówkowy, tytuł, unikalny identyfikator id oraz jeśli jest to skomplikowana tabela należy rozwinąć jej opis za pomocą znacznika `details`.

```html
<div class="table-responsive-md">
<table id="tab1" class="table table-bordered table-striped"> 
	<caption>Tytuł tabeli</caption>
		<thead>
			<tr>
				<th>Wiersz nagłówkowy</th>
				<th>Wiersz nagłówkowy</th>
				<th>Wiersz nagłówkowy</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Dane</td>
				<td>Dane</td>
				<td>Dane</td>
			</tr>
			<tr>
				<td>Dane 1</td>
				<td>Dane 1</td>
				<td>Dane 1</td>
			</tr>
		</tbody>
</table>
</div>
<details id="table">
  <summary>Szczegółowy opis tabeli</summary>
  <p>Tutaj umieszczamy szczegółowy opis tabeli</p>
  <a href="#tab1">Powrót do tabeli</a>
</details>
```

## Grafiki

Każda grafika przedstawiająca informacje powinna posiadać opis alternatywny oraz tytuł. Jeśli jest skomplikowana i przedstawia dużo treści oprócz krótkiego opisu alternatywnego należy rozwinąć opis za pomocą znacznika `details`. Każda grafika powinna posiadać unikalny identyfikator id. Opisu alternatywnego nie wymagają jedynie grafiki dekoracyjne.

```html
<figure id="img1" class="tfl-center">
  <img src="images/img.png" class="img-fluid"
     alt="Tutaj umieszczamy opis alternatywny do grafiki"/>
  <figcaption>
    Tutaj umieszczamy wyświetlany tytuł grafiki.
    <details>
        <summary>Szczegółowy opis grafiki</summary>
       <p>
       Tutaj umieszczamy szczegółowy opis grafiki.    
       </p>
    </details>
  </figcaption>
</figure>
```

## Numery stron

Strony oddzielamy za pomocą separatora - poziomej linii `<span class="nextPage"></span>`. Nie dodajemy ręcznie numerów stron - za pomocą skryptu .js zostaną one umieszczone automatycznie. Pierwsza numerowana strona w publikacji to pierwszy znacznik separatora na górze strony. Gdy w publikacji występują puste strony w adaptacji należy taką informację zawrzeć używając zdania: Pusta strona po numerze strony - znaczniku `<span class="nextPage"></span>`

## Hiperłącza

Hiperłącza należy oznaczać poprzez `a href`. Przykład <a href="http://swon.pwr.edu.pl/">Czytaj więcej na stronie Sekcji ds. Wsparcia Osób z Niepełnosprawnością</a>

```html
<a href="http://swon.pwr.edu.pl">Czytaj więcej na stronie Sekcji ds. Wsparcia Osób z Niepełnosprawnością</a>
```

## Wzory matematyczne

Wzory matematyczne opisujemy za pomocą LaTeX zamykając je w podwójnych dolarach $$ $$ dla wzoru w nowej linii, zamknięcie w znacznikach `\( \)` dla wzoru w tej samej linii. 
$$
\partial K(x)=\left\{\gamma \in \mathcal{R}^{n}: K(y) \geqslant K(x)+\gamma^{T}(y-x), \forall y \in \mathcal{R}^{n}\right\}, x \in \mathcal{X}
$$

```latex
$$ \partial K(x)=\left\{\gamma \in \mathcal{R}^{n}: K(y) \geqslant K(x)+\gamma^{T}(y-x), \forall y \in \mathcal{R}^{n}\right\}, x \in \mathcal{X}$$.
```

$$
\text{Przykład wzoru w zdaniu} M_{j}=\left\{: y_{i}-a_{i j} < 0\right\}
$$

```latex
Przykład wzoru w zdaniu \(M_{j}=\left\{: y_{i}-a_{i j} < 0\right\}\)
```

Nie zostawiamy tekstów w indeksie górnym np. liczebniki porządkowe angielskie 6<sup>th</sup> zapisujemy jako 6th.

## Kod źródłowy

Zapisując kod źródłowy należy użyć znaczników pre oraz code z odpowiednią klasą                                biblioteki highlight.js [Zobacz wykaz wspieranych języków i klas.](https://github.com/highlightjs/highlight.js/blob/master/SUPPORTED_LANGUAGES.md)

Zapisując kod źródłowy z języku HTML należy zamienić znak < oraz > na `&lt;` oraz `&gt;`. Można posłużyć się do tego automatycznym  narzędziem, np. [HTML Encoder](https://www.opinionatedgeek.com/codecs/htmlencoder).

```javascript
function detectStructure() {
    let parent = model.documentRoot;
    $(":header:not(h1)").each(function () {
        let headerLevel = this.nodeName.substring(1);
        while (headerLevel <= parent.level && parent.parent) {
            parent = parent.parent;
        }

        if (headerLevel - parent.level === 1) {
            parent = _createNewNodeAndAddToParent(this, parent);
        } else if (headerLevel - parent.level === 0) {
            parent = _createNewNodeAndAddToParent(this, parent.parent);
        } else {
            console.warn('Not consistent document structure');
        }
    });
};
```

## Oznaczenie języka

Język fragmentu tekstu należy oznaczyć poprzez umieszczenie wybranego fragmentu w znaczniku `span` oraz wybranie skrótu odpowiedniego języka np. en, pl, fr.

```html
<span lang="en">Tekst w języku innym niż język dokumentu</span>
```

- Imiona i nazwiska w obcych językach oznaczamy jako język polski, a także nazwy własne (nazwy uczelni, nazwy miast, rzek).
- Odpowiednim językiem oznaczamy tytuły publikacji, występujące np. w bibliografii, w przypisach.
- Słowa takie jak „Facebook”, „Google”, „mail” itp. zostawiamy jako język polski.
- Słowa greckie, które są zapisane alfabetem łacińskim zostawiamy jako język polski, zaś te napisane alfabetem greckim oznaczamy jako język grecki. Podobnie z językiem rosyjskim, arabskim itp.

## Cytaty

Cytaty w tej samej linii oznaczamy tagiem `<q>`, cytat długi w nowym wierszu za pomocą `<blockquote>`.

Jeżeli cytat zaczyna się na jednej stronie, a kończy na drugiej, przenosimy jego całość na stronę na której się zaczyna (o ile jego zakończenie nie zajmuje więcej niż około 25% strony). Jeżeli zajmuje więcej należy zakończyć zdanie z cytatu zaczynające się na poprzedniej stronie, wpisujemy znacznik podziału strony (span z klasą nextPage) i kończymy cytat.

## Lista, lista zagnieżdżona

Listę uporządkowaną tworzymy za pomocą znacznika `ol`, nieuporządkowane za pomocą znacznika `ul`. Listy HTML można dowolnie zagnieżdżać, rozpoczynać od wybranego numeru lub nadać jej klasę `none` i samemu dowolnie numerować. 

```html
<ol>
    <li>Pierwszy element listy</li>
    <li>Drugi element listy
        <ul>
            <li>Pierwszy element listy zagnieżdżonej</li>
            <li>Drugi element listy zagnieżdżonej</li>
        </ul>
    </li>
    <li>Trzeci element listy</li>
</ol>
```

## Dzielenie list, tabel między stronami

Jeśli na jednej stronie znajduje się jeden element listy, a na kolejnej  następne elementy należy przenieść listę na jedną stronę.

```html
<ul>
    <li>Pierwszy element listy</li>
    <li>Drugi element listy
    <span class=”nextPage”></span>
    </li>
    <li>Trzeci element listy</li>
</ul>
```

Jeśli tabela znajduje się na wielu stronach należy przed miejscem  lokalizacji tabeli wstawić tyle znaczników podziału strony span z klasą  nextPage na ilu stronach znajduje się duża tabela i po znacznikach  dopisać słownie informację: Tabela nr XX znajduje się na 3 stronach  publikacji: 121, 122, 123.

```html
<span class=”nextPage”></span>
<span class=”nextPage”></span>
<span class=”nextPage”></span>
<p>Tabela nr XX znajduje się na 3 stronach publikacji: 121, 122, 123.</p>
<table></table>
```

## Spis treści

Spis treści tworzony jest skryptem .js z nagłówków - należy zachować odpowiednią hierarchię nagłówków, aby został stworzony.

## Przypisy

Przypisy tworzymy poprzez linki, którym nadajemy unikalne id, tak aby można było zrobić odsyłacze do treści przypisu i z powrotem do treści głównej. 

```html
<a href="#1" aria-describedby="goTo" id="ref1" class="footnote">[1]</a>
```

```html
<h2 id="footnote-label">Przypisy</h2>
<div class="tfl-footer">
	<ol class="none">
  		<li id="1">1. Rozwinięcie przypisu 
            <a href="#ref1"><img src=https://cdn.jsdelivr.net/npm/bootstrap-icons/icons/box-arrow-in-up-left.svg alt="Wróć do treści"></a>
        </li>
	</ol>
</div>
```

Jeśli w publikacji występują przypisy harwardzkie również należy nadać im unikalne id, rozróżnialne od przypisów dolnych. 

```html
<a href="#h1" id="refh1" class="footnote-harvard" aria-describedby="goTo">[15]</a>
```

```html
<h2 id="footnote-label">Przypisy harwardzkie</h2>
<div class="tfl-footer">
	<ol class="none">
  		<li id="h1">15. Rozwinięcie przypisu 
            <a href="#refh1"><img src=https://cdn.jsdelivr.net/npm/bootstrap-icons/icons/box-arrow-in-up-left.svg alt="Wróć do treści"></a>
        </li>
	</ol>
</div>
```

## Skróty

Skróty występujące w tekście należy umieścić w znacznikach abbr, a rozwinięcie skróty zapisać w atrybucie title. Dodatkowo na końcu publikacji należy umieścić wykaz skrótów jako nagłówek poziomu 2.
Wykaz skrótów może być umieszczony np. przy pomocy listy punktowej. Należy przyjąć jeden wzór i stosować go do wszystkich publikacji.

Skróty których nie rozwijamy:

- itp.
- itd.
- m.in.
- np.
- str.
- s. (jeżeli występuje w przypisach, w treści można rozwinąć)
- tzn.

Przykład listy skrótów:

```html
<h2>Spis skrótów</h2>
    <ol class="none">
        <li><abbr title="rok">r.</abbr></li>
        <li><abbr title="kilobajt">kB</abbr></li>
        <li><abbr title="kilogram">kg</abbr></li>
        <li><abbr title="złoty">zł</abbr></li>
        <li><abbr title="volt">V</abbr></li>
        <li><abbr title="volt, prąd przemienny">VAC</abbr></li>
        <li><abbr title="wat">W</abbr></li>
        <li><abbr title="milisekunda">ms</abbr></li>
        <li><abbr title="megabajt">MB</abbr></li>
        <li><abbr title="volt, prąd stały">VDC</abbr></li>
        <li><abbr title="kilovolt">kV</abbr></li>
        <li><abbr title="miliamper">mA</abbr></li>
        <li><abbr title="megaherc">MHz</abbr></li>
        <li><abbr title="kiloherc">kHz</abbr></li>
        <li><abbr title="metr">m</abbr></li>
        <li><abbr title="jak wyżej">j.w.</abbr></li>
        <li><abbr title="nanosekunda">ns</abbr></li>
        <li><abbr title="megabajt">MB</abbr></li>
        <li><abbr title="kiloom">k&Omega;</abbr></li>
        <li><abbr title="megaom">M&Omega;</abbr></li>
        <li><abbr title="amper">A</abbr></li>
        <li><abbr title="om">&Omega;</abbr></li>
        <li><abbr title="mikrosekunda">&mu;s</abbr></li>
        <li><abbr title="sekunda">s</abbr></li>
        <li><abbr title="herc">Hz</abbr></li>
        <li><abbr title="minuta">min</abbr></li>
    </ol>
```

## Wyróżnienia w tekście

Wyróżnienia w tekście należy zachować jak w oryginale. Pismo pochyłe należy oznaczać tagiem `<em>`, pismo pogrubione `<strong>`. Jeśli w tekście występuje wyróżnienie jedynie kolorem należy przyjąć także inny sposób wyróżnienia, np. za pomocą pogrubienia. 

## Lista tabel

Należy pamiętać o tworzeniu unikalnych id dla tabel, aby móc stworzyć listę tabel z odnośnikami do powrotu do nich. 

## Lista grafik

Należy pamiętać o tworzeniu unikalnych id dla grafik, aby móc stworzyć listę grafik z odnośnikami do powrotu do nich. 

## Dialogi

Zapisując dialogi nie używamy list (ani punktowych, ani  numerowanych) chyba, że w oryginale dialog jest przedstawiony za pomocą  listy punktowej. W standardowym dialogu do zapisu używamy znacznika  `<p>` oraz `<br>`. Osoby mówiące w danym dialogu wyróżniamy za  pomocą `<strong>` (jeżeli w oryginale nie ma takiego wyróżnienia to  też go nie stosujemy).

Przykładowo:

```
<p><strong>A</strong>: Hey, I'm really sorry I'm late. I came as fast as I could.</p>
<p><strong>B</strong>:  It's OK. Nobody has really come  yet.</p>
<p><strong>A</strong>: Why? Where are  they?</p>
<p><strong>B</strong>: Well, John  is shopping. He is getting some food.</p>
```

## Uwagi do wersji zaadaptowanej

Wszystkie zmiany odbiegające od oryginału powinny zostać krótko opisane w uwagach do adaptacji na początku dokumentu.

Przed adaptacją treści należy uzupełnić dane początkowe tj. „Uwagi do wersji zaadaptowanej:” występujące na początku szablonu. W razie potrzeby należy dopisywać w miejsce uwag znaczące różnice, które występują między oryginałem a adaptacją.
