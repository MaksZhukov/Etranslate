import path from 'path';
import app from '../app';
import './user';
import './translate';
import './speech';
import './userDictionary';
import './dictionary';
import './pushNotifications';

app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist/index.html'));
});
