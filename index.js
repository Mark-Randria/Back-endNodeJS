const express= require('express')//classe express misy retraretra
const bodyparser=require('body-parser')//classe mapandefa lien am argument
const cors=require('cors')//licence mapande azy
const DB= require ('./dbconnexion.js')
const app=express()

const port = 2002

app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.post('/ajout_etudiant',(req,resp)=>{ // mandray avy am db fa izy mpanera post .body d get .query
    DB.query('INSERT INTO ETUDIANTS (N_INSCRIPTION,NOM,ADRESSE,SEXE,NIVEAU,ANNEE) VALUES (?,?,?,?,?,?)'
             ,[req.body.numeroi,req.body.nom,req.body.adresse,req.body.sexe,req.body.niveau,req.body.annee]
             ,(erreur,resultat)=>{
                if(erreur){resp.send(erreur)}   
                else{resp.send(resultat)}
             })
})
app.post('/ajout_matiere',(req,resp)=>{ 
    DB.query('INSERT INTO MATIERES (CODE_MAT,LIBELLE,COEF) VALUES (?,?,?)'
             ,[req.body.codematiere,req.body.libelle,req.body.coef]
             ,(erreur,resultat)=>{
                if(erreur){resp.send(erreur)}
                else{resp.send(resultat)}
             })
})

app.post('/ajout_note',(req,resp)=>{ 
    DB.query('INSERT INTO NOTEs (CODE_MAT,N_INSCRIPTION,NIVEAU,NOTE) VALUES (?,?,?,?)'
             ,[req.body.codematiere,req.body.ninscription,req.body.niveau,req.body.note]
             ,(erreur,resultat)=>{
                if(erreur){resp.send(erreur)}
                else{resp.send(resultat)}
             })
})

app.get('/recherche_etudiant',(req,resp)=>{
    DB.query(`SELECT * FROM ETUDIANTS WHERE N_INSCRIPTION LIKE ? OR NOM LIKE ? OR ADRESSE LIKE ? OR SEXE LIKE ? OR NIVEAU LIKE ? OR ANNEE LIKE ? ORDER BY N_INSCRIPTION`,
        [req.query.recherche,req.query.recherche,req.query.recherche,req.query.recherche,req.query.recherche,req.query.recherche]
        ,(erreur,resultat)=>{
            if(erreur){resp.send(erreur)}
            else{resp.send(resultat)}
        })
})

app.get('/recherche_matiere',(req,resp)=>{
    DB.query(`SELECT * FROM MATIERES WHERE CODE_MAT LIKE ? OR LIBELLE LIKE ? OR COEF LIKE ? ORDER BY CODE_MAT`,
        [req.query.recherche,req.query.recherche,req.query.recherche,req.query.recherche,req.query.recherche,req.query.recherche]
        ,(erreur,resultat)=>{
            if(erreur){resp.send(erreur)}
            else{resp.send(resultat)}
        })
})

app.get('/recherche_note',(req,resp)=>{
    DB.query(`SELECT * FROM NOTES WHERE CODE_MAT LIKE ? OR N_INSCRIPTION LIKE ? OR NIVEAU LIKE ? ORDER BY CODE_MAT`,
        [req.query.recherche,req.query.recherche,req.query.recherche,req.query.recherche]
        ,(erreur,resultat)=>{
            if(erreur){resp.send(erreur)}
            else{resp.send(resultat)}
        })
})

app.get('/bulletin',(req,resp)=>{
    DB.query(` select etudiants.n_inscription,etudiants.nom,etudiants.niveau,etudiants.annee ,sum(notes.note*matieres.coef)/(sum(matieres.coef)) as moyenne,if(sum(notes.note*matieres.coef)/(sum(matieres.coef)) <10,if(sum(notes.note*matieres.coef)/(sum(matieres.coef))<7.5,"Exclus","Redoublant"),"Admis") as Resultat from etudiants,notes,matieres where etudiants.n_inscription=notes.n_inscription and matieres.code_mat=notes.code_mat and etudiants.n_inscription=?;   `,
        [req.query.recherche]
        ,(erreur,resultat)=>{
            if(erreur){resp.send(erreur)}
            else{resp.send(resultat)}
        })
})

app.get('/bulletin2',(req,resp)=>{
    DB.query(`select matieres.libelle as designation,matieres.coef as coef,notes.note as note,notes.note*matieres.coef as pondere from etudiants,notes,matieres where etudiants.n_inscription=notes.n_inscription and matieres.code_mat=notes.code_mat and etudiants.n_inscription=? order by matieres.code_mat;   `,
        [req.query.recherche]
        ,(erreur,resultat)=>{
            if(erreur){resp.send(erreur)}
            else{resp.send(resultat)}
        })
})

app.get('/classement',(req,resp)=>{
    DB.query(`select etudiants.n_inscription,etudiants.nom,sum(notes.note*matieres.coef)/(sum(matieres.coef)) as moyenne from etudiants,notes,matieres where etudiants.annee=? and etudiants.niveau=? and etudiants.n_inscription=notes.n_inscription and matieres.code_mat=notes.code_mat and notes.niveau=etudiants.niveau  group by etudiants.n_inscription order by  moyenne desc;  `,
        [req.query.annee,req.query.niveau]
        ,(erreur,resultat)=>{
            if(erreur){resp.send(erreur)}
            else{resp.send(resultat)}
        })
})

app.delete('/supprimer_etudiant/:id',(req,resp)=>{
    DB.query(`DELETE FROM ETUDIANTS WHERE N_INSCRIPTION = ?`,
        req.params.id
        ,(erreur,resultat)=>{
            if(erreur){resp.send(erreur)}
            else{resp.send(resultat)}
        })
})

app.delete('/supprimer_matiere/:id',(req,resp)=>{
    DB.query(`DELETE FROM MATIERES WHERE CODE_MAT = ?`,
        req.params.id
        ,(erreur,resultat)=>{
            if(erreur){resp.send(erreur)}
            else{resp.send(resultat)}
        })
})

app.delete('/supprimer_note/:id/:code',(req,resp)=>{
    DB.query(`DELETE FROM NOTES WHERE N_INSCRIPTION = ? AND CODE_MAT= ?`,
        [req.params.id,req.params.code]
        ,(erreur,resultat)=>{
            if(erreur){resp.send(erreur)}
            else{resp.send(resultat)}
        })
})

app.put('/modifier_etudiant',(req,resp)=>{
    DB.query('UPDATE ETUDIANTS SET NOM=?,ADRESSE=?,SEXE=?,NIVEAU=?,ANNEE=? WHERE N_INSCRIPTION=?',
    [req.body.nom,req.body.adresse,req.body.sexe,req.body.niveau,req.body.annee,req.body.numeroi],
    (erreur,resultat)=>{
        if(erreur){resp.send(erreur)}
        else{resp.send(resultat)}        
    })
})

app.put('/modifier_matiere',(req,resp)=>{
    DB.query('UPDATE MATIERES SET LIBELLE=?,COEF=? WHERE CODE_MAT=?',
    [req.body.libelle,req.body.coef,req.body.codemat],
    (erreur,resultat)=>{
        if(erreur){resp.send(erreur)}
        else{resp.send(resultat)}        
    })
})

app.put('/modifier_note',(req,resp)=>{
    DB.query('UPDATE NOTES SET NIVEAU=?,NOTE=? WHERE CODE_MAT =? AND N_INSCRIPTION= ?',
    [req.body.niveau,req.body.note,req.body.code,req.body.ninscri],
    (erreur,resultat)=>{
        if(erreur){resp.send(erreur)}
        else{resp.send(resultat)}        
    })
})

app.listen(port, () =>{ // ecoute anle port 
    console.log(`Fonctionne correctement ${port}`)
})

