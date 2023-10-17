import '../../public/styles/globals.css'
import type {AppProps} from 'next/app'
import i18next from "i18next";
import {I18nextProvider, initReactI18next} from "react-i18next";
import {trpc} from "../lib/trpc";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const resources = {
  en: {
    translation: {
      "head.title": "Resell.cz - purchase invoice",
      "head.description": "Tool for creating purchase invoices for resell.cz.",
      "server.error": "Server error",

      "main.title": "Resell.cz invoice",
      "main.description": "Purchase invoice creation",
      "main.buttons.continue": "Continue",
      "main.buttons.back": "Back",

      "screens.code.name": "Code",
      "screens.code.code": "Security code",
      "screens.code.submit": "Submit",
      "screens.code.error.code": "Invalid security code.",

      "screens.cin.name": "CIN",
      "screens.personalInfo.name": "Personal info",
      "screens.product.name": "Product",
      "screens.final.name": "Date & signature",

      "screens.result.name": "Done",
      "screens.result.creatingPdfMsg": "Creating invoice...",
      "screens.result.failureMsg": "There was an error creating the PDF. Please fill it manually.",
      "screens.result.savingToServerMsg": "Saving to server...",
      "screens.result.warningMsg": "There was an error saving the invoice to the server. Please contact the buyer.",
      "screens.result.successMsg": "Invoice created and recorded successfully.",
      "screens.result.buttons.download": "Download PDF",


      "screens.cin.have": "I have a CIN",
      "screens.cin.dontHave": "I don't have a CIN",

      "screens.personal.label.name": "Name (company or personal)",
      "screens.personal.label.nameSurname": "First and last name",
      "screens.personal.label.email": "E-mail",
      "screens.personal.label.city": "City",
      "screens.personal.label.street": "Street",
      "screens.personal.label.zip": "ZIP",
      "screens.personal.label.country": "Country",

      "screens.personal.error.name": "Name must be at least 3 characters long.",
      "screens.personal.error.email": "Check your e-mail.",
      "screens.personal.error.city": "City must be at least 3 characters long.",
      "screens.personal.error.street": "Street must be at least 3 characters long.",
      "screens.personal.error.zip": "ZIP must be at least 3 characters long.",
      "screens.personal.error.country": "Country must be at least 3 characters long.",

      "screens.product.label.name": "Name of sneakers",
      "screens.product.label.size": "Size",
      "screens.product.label.price": "Price",
      "screens.product.label.currency": "Currency",
      "screens.product.label.cin": "CIN",
      "screens.product.label.bankAccount": "Bank account",
      "screens.product.label.iban": "IBAN",
      "screens.product.label.or": "Or",
      "screens.product.label.ibanDescription": "Enter your IBAN to pay in EUR (both Revolut and Wise have an IBAN).",
      "screens.product.label.shoeDescription": "Enter the same name you provided on the invoice (preferably the full name of the shoes as on StockX).",
      "screens.product.label.shoeDescriptionNoInvoice": "Enter the full name of the sneakers, ideally as on StockX.",
      "screens.product.label.bankAccountDescription": "Enter only the bank account form for payment in CZK. If you enter IBAN or Revolut/Wise, the payment will not be sent.",

      "screens.product.error.name": "Shoe name must be at least 3 characters long.",
      "screens.product.error.size": "Size must be filled.",
      "screens.product.error.price": "Price must be filled.",
      "screens.product.error.currency": "Currency must be filled.",
      "screens.product.error.cin": "CIN must be filled.",
      "screens.product.error.bankAccount": "Make sure the bank account is valid.",
      "screens.product.error.iban": "Make sure the IBAN is valid.",
      "screens.product.error.ibanOrBankAccount": "Either IBAN or bank account must be filled.",

      "screens.final.label.date": "Date",
      "screens.final.label.signature": "Signature",
      "screens.final.label.uploadSignature": "Or upload a photo of signature",
      "screens.final.label.changeUploadedSignature": "Change uploaded signature",
      "screens.final.label.removeUploadedSignature": "Remove uploaded signature",
      "screens.final.label.submitButton": "Save & Download PDF",
      "screens.final.label.uploadInvoice": "Upload invoice by clicking or dragging the pdf here.",
      "screens.final.label.submitButtonCin": "Save & Send",
      "screens.final.label.notice": "By signing you agree to the following conditions:\n1) The goods must be new, unworn, in 100% condition and in original packaging.\n2) The goods must not contain any manufacturing defects.\n3) The packaging must be original, including all accessories.\n4) The goods must be sent in a protective cardboard box, so that the sneaker box is not damaged.\n5) The goods must be shipped no later than 2 working days, otherwise we are entitled to an immediate refund only if needed.",

      "screens.final.hover.deleteSignature": "Delete signature",
      "screens.final.hover.uploadedSignature": "Uploaded signature",

      "screens.final.error.date": "Date must be filled.",
      "screens.final.error.signature": "You must sign the invoice either digitally, or with a photo of your signature.",
      "screens.final.error.pdfTooLarge": "File too large. Please upload a smaller file.",

      "screens.cin.label.description": "If you " +
        "have a registered business and can invoice us, tick \"I have a CIN\". If " +
        "you are only selling as a private individual, tick \"I don't have a CIN\""
    }
  },
  cs: {
    translation: {
      "head.title": "Resell.cz - výkupní faktura",
      "head.description": "Nástroj pro vytvoření výkupní faktury u resell.cz.",
      "server.error": "Chyba serveru",

      "main.title": "Výkup Resell.cz",
      "main.description": "Vytvoření výkupní faktury",
      "main.buttons.continue": "Pokračovat",
      "main.buttons.back": "Zpět",

      "screens.code.name": "Kód",
      "screens.code.code": "Bezpečnostní kód",
      "screens.code.submit": "Potvrdit",
      "screens.code.error.code": "Neplatný bezpečnostní kód.",

      "screens.cin.name": "IČO",
      "screens.personalInfo.name": "Osobní údaje",
      "screens.product.name": "Produkt",
      "screens.final.name": "Datum a podpis",

      "screens.result.name": "Hotovo",
      "screens.result.creatingPdfMsg": "Vytváření faktury...",
      "screens.result.failureMsg": "Nastala chyba při vytváření PDF. Vyplňte prosím formulář manuálně.",
      "screens.result.savingToServerMsg": "Ukládání na server...",
      "screens.result.warningMsg": "Nastala chyba při ukládání faktury na server. Informujte prosím prodejce.",
      "screens.result.successMsg": "Faktura byla úspěšně vytvořena a zaznamenána.",
      "screens.result.buttons.download": "Stáhnout PDF",

      "screens.cin.have": "Mám IČO",
      "screens.cin.dontHave": "Nemám IČO",

      "screens.personal.label.name": "Název / Jméno a příjmení",
      "screens.personal.label.nameSurname": "Jméno a příjmení",
      "screens.personal.label.email": "E-mail",
      "screens.personal.label.city": "Město",
      "screens.personal.label.street": "Ulice",
      "screens.personal.label.zip": "PSČ",
      "screens.personal.label.country": "Země",

      "screens.personal.error.name": "Jméno nebo název musí mít alespoň 3 znaky.",
      "screens.personal.error.email": "Zkontrolujte e-mail.",
      "screens.personal.error.city": "Město musí mít alespoň 3 znaky.",
      "screens.personal.error.street": "Ulice musí mít alespoň 3 znaky.",
      "screens.personal.error.zip": "PSČ musí mít alespoň 3 znaky.",
      "screens.personal.error.country": "Země musí mít alespoň 3 znaky.",

      "screens.product.label.name": "Název tenisek",
      "screens.product.label.size": "Velikost",
      "screens.product.label.price": "Cena",
      "screens.product.label.currency": "Měna",
      "screens.product.label.cin": "IČO",
      "screens.product.label.bankAccount": "Číslo účtu",
      "screens.product.label.iban": "IBAN",
      "screens.product.label.or": "Nebo",
      "screens.product.label.ibanDescription": "Zadejte svůj IBAN pro platbu v EUR (Revolut i Wise mají IBAN).",
      "screens.product.label.shoeDescription": "Zadejte stejný název, který jste uvedli na faktuře (nejlépe celý název tenisek, jako na StockX).",
      "screens.product.label.shoeDescriptionNoInvoice": "Zadejte celý název tenisek, ideálně jako na StockX.",
      "screens.product.label.bankAccountDescription": "Vložte pouze tvar bankovního účtu pro platbu v CZK. Pokud vložíte IBAN nebo Revolut/Wise, tak platba nebude odeslána.",

      "screens.product.error.name": "Název obuvi musí mít alespoň 3 znaky.",
      "screens.product.error.size": "Velikost musí být vyplněna.",
      "screens.product.error.price": "Cena musí být vyplněna.",
      "screens.product.error.currency": "Měna musí být vyplněna.",
      "screens.product.error.cin": "IČO musí být vyplněno.",
      "screens.product.error.bankAccount": "Zkontrolujte bankovní účet.",
      "screens.product.error.iban": "Zkontrolujte IBAN.",
      "screens.product.error.ibanOrBankAccount": "Musí být vyplněn buď IBAN, nebo bankovní účet.",

      "screens.final.label.date": "Datum",
      "screens.final.label.signature": "Podpis",
      "screens.final.label.uploadSignature": "Nebo nahrajte fotku podpisu",
      "screens.final.label.changeUploadedSignature": "Změnit nahraný podpis",
      "screens.final.label.removeUploadedSignature": "Odstranit nahraný podpis",
      "screens.final.label.submitButton": "Uložit a stáhnout PDF",
      "screens.final.label.uploadInvoice": "Nahrajte fakturu pomocí kliknutí, nebo přetažením sem.",
      "screens.final.label.submitButtonCin": "Uložit a odeslat",
      "screens.final.label.notice": "S podpisem souhlasíte s následujícími podmínkami:\n1) Zboží musí být nové, nenošené, v 100% stavu a v originálním balení.\n2) Zboží nesmí obsahovat žádné vady z výroby.\n3) Balení musí být původní, a to včetně veškerých doplňků.\n4) Zboží musí být zasláno v ochranné lepenkové krabici, tak aby nedošlo k poškození krabice od tenisek.\n5) Zboží musí být odesláno nejpozději do 2 pracovních dnů, jinak máme nárok pouze v případě naší potřeby na okamžité vrácení peněz.",

      "screens.final.hover.deleteSignature": "Odstranit podpis",
      "screens.final.hover.uploadedSignature": "Nahraný podpis",

      "screens.final.error.date": "Datum musí být vyplněno.",
      "screens.final.error.signature": "Musíte podpisat fakturu buď digitálně, nebo nahrát fotku podpisu.",
        "screens.final.error.pdfTooLarge": "Soubor je příliš velký. Nahrajte prosím menší soubor.",

      "screens.cin.label.description": "Pokud máte registrovanou firmu a můžete nám vystavit fakturu, zaškrtněte \"Mám IČO\". Pokud prodáváte jen jako soukromá osoba, zaškrtněte \"Nemám IČO\""
    }
  },
  de: {
    translation: {
      "head.title": "Resell.cz - Einkaufsrechnung",
      "head.description": "Tool zum Erstellen von Einkaufsrechnungen für Resell.cz.",
      "server.error": "Serverfehler",

      "main.title": "Resell.cz Rechnung",
      "main.description": "Rechnungserstellung",
      "main.buttons.continue": "Weiter",
      "main.buttons.back": "Zurück",

      "screens.code.name": "Sicherheitscode",
      "screens.code.code": "Sicherheitscode",
      "screens.code.submit": "Bestätigen",
      "screens.code.error.code": "Ungültiger Sicherheitscode.",

      "screens.cin.name": "CIN",
      "screens.personalInfo.name": "Persönliche",
      "screens.product.name": "Produkt",
      "screens.final.name": "Unterschrift",
      "screens.result.name": "Fertig",

      "screens.result.creatingPdfMsg": "Rechnung erstellen...",
      "screens.result.failureMsg": "Beim Erstellen des PDF ist ein Fehler aufgetreten. Bitte füllen Sie es hier manuell.",
      "screens.result.savingToServerMsg": "Speichern auf dem Server...",
      "screens.result.warningMsg": "Beim Speichern der Rechnung auf dem Server ist ein Fehler aufgetreten. Bitte kontaktieren Sie den Käufer.",
      "screens.result.successMsg": "Rechnung erfolgreich erstellt und aufgezeichnet.",
      "screens.result.buttons.download": "PDF herunterladen",

      "screens.cin.have": "Ich habe eine USt-IDNr",
      "screens.cin.dontHave": "Ich habe keine USt-IDNr",

      "screens.personal.label.name": "Name (Unternehmen oder Persönlich)",
      "screens.personal.label.nameSurname": "Vorname und Nachname",
      "screens.personal.label.email": "E-Mail",
      "screens.personal.label.city": "Stadt",
      "screens.personal.label.street": "Straße",
      "screens.personal.label.zip": "PLZ",
      "screens.personal.label.country": "Land",

      "screens.personal.error.name": "Name muss mindestens 3 Zeichen lang sein.",
      "screens.personal.error.email": "Überprüfen Sie Ihre E-Mail.",
      "screens.personal.error.city": "Stadt muss mindestens 3 Zeichen lang sein.",
      "screens.personal.error.street": "Straße muss mindestens 3 Zeichen lang sein.",
      "screens.personal.error.zip": "PLZ muss mindestens 3 Zeichen lang sein.",
      "screens.personal.error.country": "Land muss mindestens 3 Zeichen lang sein.",

      "screens.product.label.name": "Schuhname",
      "screens.product.label.size": "Größe",
      "screens.product.label.price": "Preis",
      "screens.product.label.currency": "Währung",
      "screens.product.label.cin": "CIN",
      "screens.product.label.bankAccount": "Bankkonto",
      "screens.product.label.iban": "IBAN",
      "screens.product.label.or": "Oder",
      "screens.product.label.ibanDescription": "Geben Sie Ihre IBAN ein, um in EUR zu zahlen (sowohl Revolut als auch Wise haben eine IBAN).",
      "screens.product.label.shoeDescription": "Geben Sie den gleichen Namen ein, den Sie auf der Rechnung angegeben haben (ideal den vollständigen Namen der Sneakers wie bei StockX).",
      "screens.product.label.shoeDescriptionNoInvoice": "Geben Sie den vollständigen Namen der Sneakers ein, idealerweise wie bei StockX.",
      "screens.product.label.bankAccountDescription": "Geben Sie nur das Bankkontoformular für die Zahlung in CZK ein. Wenn Sie IBAN oder Revolut/Wise eingeben, wird die Zahlung nicht gesendet.",

      "screens.product.error.name": "Schuhname muss mindestens 3 Zeichen lang sein.",
      "screens.product.error.size": "Größe muss ausgefüllt werden.",
      "screens.product.error.price": "Preis muss ausgefüllt werden.",
      "screens.product.error.currency": "Währung muss ausgefüllt werden.",
      "screens.product.error.cin": "CIN muss ausgefüllt werden.",
      "screens.product.error.bankAccount": "Stellen Sie sicher, dass das Bankkonto gültig ist.",
      "screens.product.error.iban": "Stellen Sie sicher, dass die IBAN gültig ist.",
      "screens.product.error.ibanOrBankAccount": "Entweder IBAN oder Bankkonto müssen ausgefüllt werden.",

      "screens.final.label.date": "Datum",
      "screens.final.label.signature": "Unterschrift",
      "screens.final.label.uploadSignature": "Oder laden Sie ein Foto Ihrer Unterschrift hoch",
      "screens.final.label.changeUploadedSignature": "Hochgeladene Unterschrift ändern",
      "screens.final.label.removeUploadedSignature": "Hochgeladene Unterschrift entfernen",
      "screens.final.label.submitButton": "Speichern & PDF herunterladen",
      "screens.final.label.uploadInvoice": "Laden Sie die Rechnung hier hoch, indem Sie hier klicken oder das PDF hierher ziehen.",
      "screens.final.label.submitButtonCin": "Speichern und senden",
      "screens.final.label.notice": "Mit der Unterschrift stimmen Sie den folgenden Bedingungen zu:\n1) Die Ware muss neu, ungetragen, zu 100% im Originalzustand und in der Originalverpackung sein.\n2) Die Ware darf keine Produktionsfehler aufweisen.\n3) Die Verpackung muss original sein, einschließlich aller Zubehörteile.\n4) Die Ware muss in einer schützenden Pappbox verschickt werden, sodass der Sneakerkarton nicht beschädigt wird.\n5) Die Ware muss spätestens innerhalb von 2 Werktagen verschickt werden, ansonsten haben wir nur bei Bedarf Anspruch auf eine sofortige Rückerstattung.",


      "screens.final.hover.deleteSignature": "Unterschrift löschen",
      "screens.final.hover.uploadedSignature": "Hochgeladene Unterschrift",

      "screens.final.error.date": "Datum muss ausgefüllt werden.",
      "screens.final.error.signature": "Sie müssen die Rechnung digital unterschreiben oder mit einem Foto Ihrer Unterschrift.",
      "screens.final.error.pdfTooLarge": "Datei zu groß. Bitte laden Sie eine kleinere Datei hoch.",

      "screens.cin.label.description": "Wenn Sie ein eingetragenes Unternehmen haben und uns eine Rechnung ausstellen können, aktivieren Sie \"Ich habe eine USt-IDNr.\". Wenn Sie nur als Privatperson verkaufen, aktivieren Sie \"Ich habe keine USt-IDNr.\""
    }
  },
  pl: {
    translation: {
      "head.title": "Resell.cz - faktura zakupu",
      "head.description": "Narzędzie do tworzenia faktur zakupu dla resell.cz.",
      "server.error": "Błąd serwera",

      "main.title": "Faktura Resell.cz",
      "main.description": "Tworzenie faktury zakupu",
      "main.buttons.continue": "Kontynuuj",
      "main.buttons.back": "Cofnij",

      "screens.code.name": "Kod",
      "screens.code.code": "Kod bezpieczeństwa",
      "screens.code.submit": "Potwierdź",
      "screens.code.error.code": "Nieprawidłowy kod bezpieczeństwa.",

      "screens.cin.name": "CIN",
      "screens.personalInfo.name": "Dane osobowe",
      "screens.product.name": "Produkt",
      "screens.final.name": "Data i podpis",
      "screens.result.name": "Gotowe",

      "screens.result.creatingPdfMsg": "Tworzenie faktury...",
      "screens.result.failureMsg": "Wystąpił błąd podczas tworzenia PDF. Proszę wypełnić to ręcznie.",
      "screens.result.savingToServerMsg": "Zapisywanie na serwerze...",
      "screens.result.warningMsg": "Wystąpił błąd podczas zapisywania faktury na serwerze. Skontaktuj się z kupującym.",
      "screens.result.successMsg": "Faktura utworzona i zapisana pomyślnie.",
      "screens.result.buttons.download": "Pobierz PDF",

      "screens.cin.have": "Mam NIP",
      "screens.cin.dontHave": "Nie mam NIP",

      "screens.personal.label.name": "Nazwa (firma lub osobista)",
      "screens.personal.label.nameSurname": "Imię i nazwisko",

      "screens.personal.label.email": "E-mail",
      "screens.personal.label.city": "Miasto",
      "screens.personal.label.street": "Ulica",
      "screens.personal.label.zip": "Kod pocztowy",
      "screens.personal.label.country": "Kraj",

      "screens.personal.error.name": "Nazwa musi mieć co najmniej 3 znaki.",
      "screens.personal.error.email": "Sprawdź swój adres e-mail.",
      "screens.personal.error.city": "Miasto musi mieć co najmniej 3 znaki.",
      "screens.personal.error.street": "Ulica musi mieć co najmniej 3 znaki.",
      "screens.personal.error.zip": "Kod pocztowy musi mieć co najmniej 3 znaki.",
      "screens.personal.error.country": "Kraj musi mieć co najmniej 3 znaki.",

      "screens.product.label.name": "Nazwa butów",
      "screens.product.label.size": "Rozmiar",
      "screens.product.label.price": "Cena",
      "screens.product.label.currency": "Waluta",
      "screens.product.label.cin": "CIN",
      "screens.product.label.bankAccount": "Konto bankowe",
      "screens.product.label.iban": "IBAN",
      "screens.product.label.or": "Lub",
      "screens.product.label.ibanDescription": "Wprowadź swój IBAN, aby płacić w EUR (zarówno Revolut, jak i Wise mają IBAN).",
      "screens.product.label.shoeDescription": "Wpisz tę samą nazwę, którą podałeś na fakturze (najlepiej pełną nazwę butów tak jak na StockX).",
      "screens.product.label.shoeDescriptionNoInvoice": "Wpisz pełną nazwę butów, najlepiej tak jak na StockX.",
      "screens.product.label.bankAccountDescription": "Wprowadź tylko formularz konta bankowego do płatności w CZK. Jeśli wprowadzisz IBAN lub Revolut/Wise, płatność nie zostanie wysłana.",
      "screens.product.error.name": "Nazwa butów musi mieć co najmniej 3 znaki.",
      "screens.product.error.size": "Rozmiar musi być wypełniony.",
      "screens.product.error.price": "Cena musi być wypełniona.",
      "screens.product.error.currency": "Waluta musi być wypełniona.",
      "screens.product.error.cin": "CIN musi być wypełniony.",
      "screens.product.error.bankAccount": "Upewnij się, że konto bankowe jest prawidłowe.",
      "screens.product.error.iban": "Upewnij się, że IBAN jest prawidłowy.",
      "screens.product.error.ibanOrBankAccount": "IBAN lub konto bankowe musi być wypełnione.",

      "screens.final.label.date": "Data",
      "screens.final.label.signature": "Podpis",
      "screens.final.label.uploadSignature": "Lub prześlij zdjęcie podpisu",
      "screens.final.label.changeUploadedSignature": "Zmień przesłany podpis",
      "screens.final.label.removeUploadedSignature": "Usuń przesłany podpis",
      "screens.final.label.submitButton": "Zapisz i pobierz PDF",
      "screens.final.label.uploadInvoice": "Prześlij fakturę klikając lub przeciągając plik pdf tutaj.",
      "screens.final.label.submitButtonCin": "Zapisz i wyślij",
      "screens.final.label.notice": "Podpisując, zgadzasz się na następujące warunki:\n1) Towar musi być nowy, nienoszony, w 100% stanie i w oryginalnym opakowaniu.\n2) Towar nie może zawierać wad produkcyjnych.\n3) Opakowanie musi być oryginalne, w tym wszystkie akcesoria.\n4) Towar musi być wysłany w ochronnym pudle kartonowym, aby nie uszkodzić pudełka butów.\n5) Towar musi zostać wysłany najpóźniej w ciągu 2 dni roboczych, w przeciwnym razie mamy prawo tylko w razie potrzeby do natychmiastowego zwrotu pieniędzy.",

      "screens.final.hover.deleteSignature": "Usuń podpis",
      "screens.final.hover.uploadedSignature": "Przesłany podpis",

      "screens.final.error.date": "Data musi być wypełniona.",
      "screens.final.error.signature": "Musisz podpisać fakturę cyfrowo lub zdjęciem swojego podpisu.",
      "screens.final.error.pdfTooLarge": "Plik jest za duży. Prześlij mniejszy plik.",

      "screens.cin.label.description": "Jeśli masz zarejestrowaną firmę i możesz wystawić nam fakturę, zaznacz \"Mam NIP\". Jeśli sprzedajesz tylko jako osoba prywatna, zaznacz \"Nie mam NIP\""
    }
  }
}

i18next
  .use(initReactI18next)
  .init({
    resources: resources,
    lng: "cs",
    interpolation: {escapeValue: false},  // React already does escaping.
  });

function App({Component, pageProps}: AppProps) {
  return (
    <I18nextProvider i18n={i18next}>
      <ToastContainer position={"top-center"} />
      <Component {...pageProps} />
    </I18nextProvider>
  )
}

export default trpc.withTRPC(App);