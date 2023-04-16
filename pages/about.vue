<script setup lang="ts">
useSeoMeta({
  title: `About`
});
</script>

<template>
  <h1 class="text-3xl mb-4">About</h1>
  <div class="flex flex-col gap-2">
    <p>
      Diese Auswertung ist im Rahmen meiner Bachelorthesis mit dem Thema
      "Entwicklung eines Frameworks zur Auswertung und interaktiven
      Visualisierung von Echtzeit-Verspätungsdaten nach GTFS" entstanden.
    </p>
    <p>
      Alle Daten dafür stammen direkt von der
      <a href="https://vbn.de" target="_blank">VBN</a> und stehen unter der
      <a
        href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.de"
        target="_blank"
        >CC BY-SA 4.0 Lizenz</a
      >. Diese Arbeit ist dementsprechend unter der selben Lizenz
      veröffentlicht.
    </p>
    <p>Auswertungszeitraum: 02.01.2022 - 31.12.2022</p>
    <p>
      Auszuwertender Vekehrsbetrieb:
      <a href="https://bsag.de" target="_blank">BSAG</a>
    </p>
    <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
    <div class="imprint">
      <h2>Angaben gemäß § 5 TMG:</h2>
      <p>
        Pascal Syma<br />
        Duckwitzstraße 50<br />
        28199 Bremen
      </p>
      <h2>Kontakt:</h2>
      <table>
        <tbody>
          <tr>
            <td>Telefon:</td>
            <td>+49 (0) 4221 978765</td>
          </tr>
          <tr>
            <td>E-Mail:</td>
            <td>delay@syma.dev</td>
          </tr>
        </tbody>
      </table>
      <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h2>
      <p>
        Pascal Syma<br />
        Duckwitzstraße 50<br />
        28199 Bremen
      </p>
      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf
        diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8
        bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
        übermittelte oder gespeicherte fremde Informationen zu überwachen oder
        nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
        hinweisen.
      </p>
      <p>
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
        Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
        Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
        Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von
        entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
        entfernen.
      </p>
      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren
        Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
        Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
        Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
        verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
        Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte
        waren zum Zeitpunkt der Verlinkung nicht erkennbar.
      </p>
      <p>
        Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch
        ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
        Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
        entfernen.
      </p>
      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
        Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
        Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
        Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
        jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
        sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
      </p>
      <p>
        Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden,
        werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
        Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
        Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
        entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden
        wir derartige Inhalte umgehend entfernen.
      </p>
      <p>&nbsp;</p>
      <p>
        Quelle:
        <a href="https://www.erecht24.de" target="_blank"
          >https://www.e-recht24.de</a
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
a {
  @apply underline text-black hover:text-gray-50 bg-none hover:bg-gray-800 transition-colors;
}

.imprint > h2 {
  @apply text-2xl mt-4 mb-2;
}
</style>
