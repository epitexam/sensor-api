const axios = require('axios');

/**
 * Envoie un email d'alerte pour la qualité de l'air en fonction du niveau de CO2.
 *
 * @param {Array<string>} emails - Liste des adresses email des destinataires.
 * @param {number} co2Level - Le niveau de CO2 en ppm à surveiller.
 * @param {string} roomName - Le nom de la salle où le niveau de CO2 est anormal.
 * @returns {Promise<void>} - Une promesse qui résout si l'email a été envoyé avec succès.
 *
 * @throws {Error} Si une erreur se produit lors de l'envoi de l'email.
 */
const sendEmailToMultipleRecipients = async (emails, co2Level, roomName) => {
    let subject = `Alerte qualité de l'air dans la salle ${roomName}`;
    let text = `Le niveau de CO2 dans la salle ${roomName} est anormalement élevé. Veuillez prendre les mesures nécessaires pour votre sécurité.`;
    let html = `<div style="font-family: Arial, sans-serif; text-align: center; font-size: 18px; padding: 20px;">
              <p><strong>Alerte : Niveau de CO2 élevé détecté dans la salle ${roomName} !</strong></p>
              <p>Le niveau de CO2 dans la salle ${roomName} est de <strong>${co2Level} ppm</strong>.</p>`;

    // Choisir le message en fonction du niveau de CO2
    if (co2Level >= 1200) {
        subject = `Alerte Urgente : Quittez immédiatement les lieux - Salle ${roomName}`;
        text = `Le niveau de CO2 a atteint ${co2Level} ppm dans la salle ${roomName}. Il est impératif de quitter immédiatement les lieux pour votre sécurité.`;
        html += `<p style="color: red;"><strong>Attention ! Le niveau de CO2 a atteint ${co2Level} ppm dans la salle ${roomName}. Vous devez <u>quitter immédiatement les lieux</u> pour garantir votre sécurité.</strong></p>`;
    } else if (co2Level >= 800) {
        subject = `Alerte : Ouvrez les fenêtres dans la salle ${roomName}`;
        text = `Le niveau de CO2 est de ${co2Level} ppm dans la salle ${roomName}. Pour améliorer la qualité de l'air, veuillez ouvrir les fenêtres immédiatement.`;
        html += `<p style="color: orange;"><strong>Le niveau de CO2 est de ${co2Level} ppm dans la salle ${roomName}. Pour garantir un air respirable, <u>ouvrez les fenêtres</u> sans délai.</strong></p>`;
    } else {
        subject = `Qualité de l'air normale dans la salle ${roomName}`;
        text = `Le niveau de CO2 dans la salle ${roomName} est dans la plage normale. Aucune action n'est requise.`;
        html += `<p style="color: green;"><strong>Le niveau de CO2 est normal dans la salle ${roomName} et ne nécessite aucune action.</strong></p>`;
    }

    html += `<p style="margin-top: 30px;">Cordialement,<br />L'équipe de surveillance de la qualité de l'air</p></div>`;

    const data = {
        "Attachments": [
            {
                "Content": "iVBORw0KGgoAAAANSUhEUgAAAEEAAAA8CAMAAAAOlSdoAAAACXBIWXMAAAHrAAAB6wGM2bZBAAAAS1BMVEVHcEwRfnUkZ2gAt4UsSF8At4UtSV4At4YsSV4At4YsSV8At4YsSV4At4YsSV4sSV4At4YsSV4At4YtSV4At4YsSV4At4YtSV8At4YsUWYNAAAAGHRSTlMAAwoXGiktRE5dbnd7kpOlr7zJ0d3h8PD8PCSRAAACWUlEQVR42pXT4ZaqIBSG4W9rhqQYocG+/ys9Y0Z0Br+x3j8zaxUPewFh65K+7yrIMeIY4MT3wPfEJCidKXEMnLaVkxDiELiMz4WEOAZSFghxBIypCOlKiAMgXfIqTnBgSm8CIQ6BImxEUxEckClVQiHGj4Ba4AQHikAIClwTE9KtIghAhUJwoLkmLnCiAHJLRKgIMsEtVUKbBUIwoAg2C4QgQBE6l4VCnApBgSKYLLApCnCa0+96AEMW2BQcmC+Pr3nfp7o5Exy49gIADcIqUELGfeA+bp93LmAJp8QJoEcN3C7NY3sbVANixMyI0nku20/n5/ZRf3KI2k6JEDWQtxcbdGuAqu3TAXG+/799Oyyas1B1MnMiA+XyxHp9q0PUKGPiRAau1fZbLRZV09wZcT8/gHk8QQAxXn8VgaDqcUmU6O/r28nbVwXAqca2mRNtPAF5+zoP2MeN9Fy4NgC6RfcbgE7XITBRYTtOE3U3C2DVff7pk+PkUxgAbvtnPXJaD6DxulMLwOhPS/M3MQkgg1ZFrIXnmfaZoOfpKiFgzeZD/WuKqQEGrfJYkyWf6vlG3xUgTuscnkNkQsb599q124kdpMUjCa/XARHs1gZymVtGt3wLkiFv8rUgTxitYCex5EVGec0Y9VmoDTFBSQte2TfXGXlf7hbdaUM9Sk7fisEN9qfBBTK+FZcvM9fQSdkl2vj4W2oX/bRogO3XasiNH7R0eW7fgRM834ImTg+Lg6BEnx4vz81rhr+MYPBBQg1v8GndEOrthxaCTxNAOut8WKLGZQl+MPz88Q9tAO/hVuSeqQAAAABJRU5ErkJggg==",
                "ContentID": "mailpit-logo",
                "ContentType": "image/png",
                "Filename": "mailpit.png"
            }
        ],
        "Bcc": ["jack@example.com"],
        "Cc": [
            {
                "Email": "manager@example.com",
                "Name": "Manager"
            }
        ],
        "From": {
            "Email": "john@example.com",
            "Name": "John Doe"
        },
        "HTML": html,
        "Headers": {
            "X-IP": "1.2.3.4"
        },
        "ReplyTo": [
            {
                "Email": "secretary@example.com",
                "Name": "Secretary"
            }
        ],
        "Subject": subject,
        "Tags": ["Tag 1", "Tag 2"],
        "Text": text,
        "To": emails.map(email => ({ Email: email, Name: email.split('@')[0] }))
    };

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    try {
        // Envoi de la requête POST avec axios
        const response = await axios.post(`http://${process.env.MAILPITHOST}:${process.env.MAILPITPORT}/api/v1/send`, data, { headers });
        console.log('Message envoyé avec succès:', response.data);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
};

module.exports = sendEmailToMultipleRecipients;  // Exportation de la fonction
