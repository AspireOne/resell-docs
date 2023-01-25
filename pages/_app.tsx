import '../styles/globals.css'
import type { AppProps } from 'next/app'
import i18next from "i18next";
import {I18nextProvider, initReactI18next} from "react-i18next";

  export const resources = {
    en: {
      translation: {
        "head.title": "Resell.cz - purchase invoice",
        "head.description": "Tool for creating purchase invoices for resell.cz.",

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

        "screens.result.progressMsg": "Creating invoice...",
        "screens.result.failureMsg": "There was an error creating the PDF. Please fill it manually here: {{url}}.",
        "screens.result.savingToServerMsg": "Saving to server...",
        "screens.result.warningMsg": "There was an error saving the invoice to the server, but the PDF was downloaded. Please contact the buyer.",
        "screens.result.successMsg": "Invoice created and recorded successfully.",

        "screens.cin.have": "I have a CIN",
        "screens.cin.dontHave": "I don't have a CIN",

        "screens.personal.label.name": "Name (company or personal)",
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

        "screens.product.label.name": "Shoe name",
        "screens.product.label.size": "Size",
        "screens.product.label.price": "Price",
        "screens.product.label.currency": "Currency",
        "screens.product.label.cin": "CIN",
        "screens.product.label.bankAccount": "Bank account",
        "screens.product.label.iban": "IBAN",
        "screens.product.label.or": "Or",

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

        "screens.final.hover.deleteSignature": "Delete signature",
        "screens.final.hover.uploadedSignature": "Uploaded signature",

        "screens.final.error.date": "Date must be filled.",
        "screens.final.error.signature": "You must sign the invoice either digitally, or with a photo of your signature.",
      }
    },
    cs: {
      translation: {
        "head.title": "Resell.cz - výkupní faktura",
        "head.description": "Nástroj pro vytvoření výkupní faktury u resell.cz.",

        "main.title": "Výkup resell.cz",
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
        "screens.result.progressMsg": "Vytváření faktury...",
        "screens.result.failureMsg": "Nastala chyba při vytváření PDF. Vyplňte prosím manuálně tento formulář: {{url}}.",
        "screens.result.savingToServerMsg": "Ukládání na server...",
        "screens.result.warningMsg": "Nastala chyba při ukládání faktury na server, ale PDF bylo úspěšně staženo. Informujte prosím prodejce.",
        "screens.result.successMsg": "Faktura byla úspěšně vytvořena a zaznamenána.",

        "screens.cin.have": "Mám IČO",
        "screens.cin.dontHave": "Nemám IČO",

        "screens.personal.label.name": "Název / Jméno a příjmení",
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

        "screens.product.label.name": "Název obuvi",
        "screens.product.label.size": "Velikost",
        "screens.product.label.price": "Cena",
        "screens.product.label.currency": "Měna",
        "screens.product.label.cin": "IČO",
        "screens.product.label.bankAccount": "Číslo účtu",
        "screens.product.label.iban": "IBAN",
        "screens.product.label.or": "Nebo",

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

        "screens.final.hover.deleteSignature": "Odstranit podpis",
        "screens.final.hover.uploadedSignature": "Nahraný podpis",

        "screens.final.error.date": "Datum musí být vyplněno.",
        "screens.final.error.signature": "Musíte podpisat fakturu buď digitálně, nebo nahrát fotku podpisu.",
      }
    },
    de: {
      translation: {
        "head.title": "Resell.cz - Einkaufsrechnung",
        "head.description": "Tool zum Erstellen von Einkaufsrechnungen für Resell.cz.",

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

        "screens.result.progressMsg": "Rechnung erstellen...",
        "screens.result.failureMsg": "Beim Erstellen des PDF ist ein Fehler aufgetreten. Bitte füllen Sie es hier manuell aus: {{url}}.",
        "screens.result.savingToServerMsg": "Speichern auf dem Server...",
        "screens.result.warningMsg": "Beim Speichern der Rechnung auf dem Server ist ein Fehler aufgetreten, aber das PDF wurde heruntergeladen. Bitte kontaktieren Sie den Käufer.",
        "screens.result.successMsg": "Rechnung erfolgreich erstellt und aufgezeichnet.",

        "screens.cin.have": "Ich habe eine CIN",
        "screens.cin.dontHave": "Ich habe keine CIN",

        "screens.personal.label.name": "Name (Unternehmen oder Persönlich)",
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

        "screens.final.hover.deleteSignature": "Unterschrift löschen",
        "screens.final.hover.uploadedSignature": "Hochgeladene Unterschrift",

        "screens.final.error.date": "Datum muss ausgefüllt werden.",
        "screens.final.error.signature": "Sie müssen die Rechnung digital unterschreiben oder mit einem Foto Ihrer Unterschrift.",
      }
    },
    pl: {
      translation: {
        "head.title": "Resell.cz - faktura zakupu",
        "head.description": "Narzędzie do tworzenia faktur zakupu dla resell.cz.",

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

        "screens.result.progressMsg": "Tworzenie faktury...",
        "screens.result.failureMsg": "Wystąpił błąd podczas tworzenia PDF. Proszę wypełnić to ręcznie tutaj: {{url}}.",
        "screens.result.savingToServerMsg": "Zapisywanie na serwerze...",
        "screens.result.warningMsg": "Wystąpił błąd podczas zapisywania faktury na serwerze, ale PDF został pobrany. Skontaktuj się z kupującym.",
        "screens.result.successMsg": "Faktura utworzona i zapisana pomyślnie.",

        "screens.cin.have": "Mam CIN",
        "screens.cin.dontHave": "Nie mam CIN",

        "screens.personal.label.name": "Nazwa (firma lub osobista)",
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

        "screens.final.hover.deleteSignature": "Usuń podpis",
        "screens.final.hover.uploadedSignature": "Przesłany podpis",

        "screens.final.error.date": "Data musi być wypełniona.",
        "screens.final.error.signature": "Musisz podpisać fakturę cyfrowo lub zdjęciem swojego podpisu.",
      }
    }
  } as const;

  i18next
      .use(initReactI18next)
      .init({
        resources: resources,
        lng: "cs",
        interpolation: { escapeValue: false },  // React already does escaping.
      });

export default function App({ Component, pageProps }: AppProps) {
  return (
      <I18nextProvider i18n={i18next}>
        <Component {...pageProps} />
      </I18nextProvider>
  )
}
