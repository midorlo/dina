# Frontend Code Architecture

Prüfe sämtliche pages im frontend. Einige davon haben derzeit noch api calls programmlogik intern implementiert. Ersetze
solche Vorkommen, indem du die bestehende service-architektur nutzt oder ggf. erweiterst.

## Frontend Anbindung

Mach einen Vorschlag, wie wir am besten das backend an das frontend anbinden. Derzeit nutzen wir stattdessen die Mock Daten, 
aber bald sollten wir weit genug sein, um eine echte Anbindung zu haben.


## Frontend Features

Erstell bitte eine Avatar Komponente auf Basis von der Vuetify Avatar Komponente. Was ich zusätzlich zu der benötige sind:

    - Ein online-indikator (Kleiner grüner Kreis links unten reicht)
    - Ein popup menu mit den Links "Profil", und "Nachricht schreiben".

Alle neuen features müssen optional sein und per default auch nicht aktiv, dh. das Ding muss im Fallesfall auch als drop-in-replacement für bestehende nutzungen
von vuetify avatar funktionieren. 


## Breadcrumb

Der Breadcrumb zeigt noch immer an vielen Stellen doppelte oder falsche infos an.
Beispiele: 
- http://localhost:3000/conversations
- http://localhost:3000/notifications
- http://localhost:3000/blogs
- http://localhost:3000/photos/u1

Mach das bitte endlich sauber!

Und wenn du schon dabei bist, nimm bitte unser text-logo aus den assets und nutze es dort, wo im breadcrumb derzeit "Dina" steht. Achte aber auf ne gescheite size. Machs ungefähr so wie youtube, das sollte passen

## Login

Der Login hat ein zu schlechtes UX. Der loading/busy state sollte sichtbar sein, damit der user bei langsamem backend oder schlechtem internetempfang seines handies nicht verunsichert ist, ob er interagiert hat oder sich verklickt.



## Style

- Das App Icon in der Sidebar ist mir zu klein. Bitte finde eine ästetischere lösung
- Die Anzeige von Fehlern, zb. 403 ist immernoch kaputt und zeigt das layout doppelt.

## Pages

Prüf mal ob wir die page "[...path].vue" überhaupt brauchen.

## Conversations

Die Conversations Page ist nicht responsive genug. Siehe dazu den Screenshot todo-conversations.png

Die Conversations Page ist nicht effizient genug. Derzeit lädt sie alle Konversationen samt aller Nachrichten initial. Das wird vorhersehbar Probleme machen, wenn zuviele Daten vorliegen. Wir sollten hier den service überarbeiten sodass wir eine übersicht aller konversationen getrennt beziehen können. Am besten sollte sogar diese nicht komplett bezogen werden, sondern als endless scroll. Dies sollte für die messages einer konversation ebenso sein. Natürlich ist dann die sortierung wichtig, damit wir bei langen gesprächen zuerst die neusten, und nicht die älteresten nachrichten geladen haben.

## Profile

Die Profile Det View funktioniert derzeit nicht. Wenn ich ein profil aus der liste klicke, krieg ich immer nur ne not-found inhalt angezeigt

## Blogs

Bitte erweiter die Daten und View der Community Blogs übersicht. Ich will in den Cards mindestens noch angezeigt bekommen, wieviele Beiträge die Blogs jeweils haben, und wie als der letzte Beitrag ist. Und gestalte die Cards ruhig mal etwas professioneller.

## Blogs - Posts

Ich kann derzeit keine posts anzeigen, sondern bekomm die 403 page. Posts sollte jeder lesen können


### Notifications

Das dropdown dialog im usermenu der topbar im default layout ist ansich super, aber es ist halt nicht responsive.
Wir sollten uns hier erstmal das leben einfach machen, und abhängig vom breakpoint entweder das ding einblenden, wie bisher;
oder halt auf kleine bildschirmen stattdessen zur notifications page routen.