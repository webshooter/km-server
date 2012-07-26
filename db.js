var mysql = require('mysql'),
    MYSQL_HOST     = "localhost"
    MYSQL_USERNAME = 'kingme',
    MYSQL_PASSWORD = 'kingme';
 
var client = mysql.createConnection({
  host:     MYSQL_HOST,
  user:     MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
});
client.connect();
client.query('USE kingme');



function newPlayer(data, callback) {

  var rndId = getRandomId(25);

  playerExists(data.name, data.email, function(exists) { 
    if (exists) {
      console.log("Cannot insert new player, either the name or email is a duplicate.");
      return { playerid: "" };
    } else {
      client.query("insert into players (id, name, email, pwd) values (?,?,?,?)",
        [rndId, data.name, data.email, data.pwd],
        function(err, result) {
          if (err) { throw err; }
          console.log("Player " + data.name + " (" + data.email + ") added to PLAYERS. [" + rndId + "]");
          if (result.affectedRows == 1) {
            client.query("insert into prefs (playerid) values (?)",
              [rndId],
              function (err, result) {
                if (err) { throw err; }
                console.log("Player " + data.name + " (" + data.email + ") added to PREFS. [" + rndId + "]");
              }
            );
            callback( { "playerid": rndId, "name": data.name, "email": data.email } );
          }
        }
      );
    }
  });
}

function playerExists (playerName, playerEmail, callback) {
  client.query("select count(*) as cnt from players where name like (?);",
    [playerName],
    function(err, rows, fields) {
      if (err) { throw err; }
      if (rows[0].cnt > 0) {
        console.log("duplicate player name: "  + playerName);
        callback(true);
      } else {
        client.query("select count(*) as cnt from players where email like (?);",
          [playerEmail],
          function(err, rows, fields) {
            if (err) { throw err; }
            if (rows[0].cnt > 0) {
              console.log("duplicate player email: "  + playerEmail);
              callback(true);
            } else {
              callback(false);
            }
          }
        );
      }
    }
  );
}

function validateField(field, value, callback) {
  var sql = "";
  if (field.toLowerCase() == "name") {
    sql = "select count(*) as cnt from players where name like (?)";
  } else if (field.toLowerCase() == "email") {
    sql = "select count(*) as cnt from players where email like (?)";
  }
  client.query(sql, [value], 
    function(err, rows, fields) {
      var results = { available: false };
      if (err) { throw err; }
      if (rows[0].cnt < 1) {
        results = { available: true };
      }
      callback(results);
    }
  );
}

function login (name, pwd, callback) {
  var sql = "select players.id, players.name, players.email, players.pwd from players where name like (?)";
  client.query(sql, [name], 
    function(err, rows, fields) {
      var results = { login: false, msg: "User not found" };
      if (err) { throw err; }
      if (rows.length > 0) {
        if (rows[0].pwd == pwd) {
          results = { 
            login: true,
            msg: "Login successful",
            name: rows[0].name,
            email: rows[0].email,
            playerid: rows[0].id
          };
        } else {
          results = { 
            login: false, 
            msg: "Invalid password"
          };
        }
      }
      callback(results);
    }
  );
}

function play (playerid, opponentName, callback) {
  var sql = "";

  // find opponent and get id
  sql = "select players.id from players where name like (?)";
  client.query(sql, [opponentName], 
    function(err, rows, fields) {
      var opponentid = null;
      if (err) { throw err; }
      if (rows.length > 0) {
        opponentid = rows[0].id;
        if (opponentid != null) {
          // found opponent in db, create the new game
          createNewGame(playerid, opponentid,
            function(newgameid) {
              var results = {};
              if (newgameid != null) {
                // game creation successfull
                // 1. send data back to player
                results = {
                  gameid: newgameid,
                  turn: false,
                  boarstate: "11111111111100000000222222222222"
                };
                // 2. send notice to opponent
                //
              } else {
                // game creation failed
                results = {
                  gameid: null,
                  msg: "Game creation failed"
                }
              }
              callback(results);
            }
          );
        } else {
          // unable to find opponent in db
          callback({
            gameid: null,
            msg: "Unable to find player " + opponentName
          });
        }
      }
    }
  );

}

function createNewGame (playerid, opponentid, callback) {
  var rndId = getRandomId(25),
      sql = "insert into games (id, playerid, opponentid, activeid) values (?,?,?,?)";

      client.query(sql,[rndId, playerid, opponentid, opponentid],
        function(err, result) {
          var gameid = null;
          if (err) { throw err; }
          if (result.affectedRows = 1) {
            gameid = rndId;
          }
          callback(gameid);
        }
      );

}

function getGameData(gameid, callback) {
  var sql = "select * from games where id like (?)";
  client.query(sql, [gameid],
    function(err, rows, fields) {
      if (err) { throw err; }
      if (rows.length > 0) {
        callback(rows[0]);
      }
    }
  );
}

function getMostRecentMoveData(gameid, callback) {
  var sql = "select *, max(dtstamp) from moves where gameid like (?)";
  client.query(sql, [gameid], 
    function(err, rows, fields) {
      if (err) { throw err; }
      if (rows.length > 0) {
        callback(rows[0]);
      }
    }
  );
}

function updateMove(gameid, playerid, move, boardstate, callback) {
  var sql = "insert into moves (gameid, playerid, move, boardstate) " + 
              "values (?,?,?,?)";
  client.query(sql, [gameid, playerid, move, boardstate], 
    function(err, result) {
      callback(result.affectedRows);
    }
  );
}

function updateTurn(gameid, activeid, callback) {
  var sql = "update games set activeid = ? where id like (?)";
  client.query(sql, [activeid, gameid], 
    function(err, result) {
      callback(result.affectedRows);
    }
  );
}

function updatePrefs(playerid, prefs) {
  if (prefs) {
    var boardPrefs  = prefs.board,
        colorsPrefs = prefs.colors,
        bgPrefs     = prefs.background,
        sql         = "";

        boardPrefs.showBorder = (boardPrefs.showBorder) ? 1 : 0;

    // TODO: Write code to validate prefs values to
    //       keep junk data out of database

    sql = "update prefs " +
            "set board_size = ?, " +
            "set board_showborder = ?, " +
            "set board_borderwidth = ?, " +
            "set board_borderstyle = ?, " +
            "set board_checkersize = ?, " +
            "set colors_mycolor = ?, " +
            "set colors_opponent = ?, " +
            "set colors_square = ?, " +
            "set colors_board = ?, " +
            "set colors_border = ?, " +
            "set colors_hiliteselected = ?, " +
            "set colors_hilite = ?, " +
            "set background_color = ?, " +
            "set background_img = ?, " +
          "where playerid = " + playerid;

    client.query(sql,
                 [
                  boardPrefs.size,
                  boardPrefs.showBorder,
                  boardPrefs.borderWidth,
                  boardPrefs.borderStyle,
                  boardPrefs.checkerSize,
                  colorsPrefs.myCheckers,
                  colorsPrefs.opponentCheckers,
                  colorsPrefs.square,
                  colorsPrefs.board,
                  colorsPrefs.border,
                  colorsPrefs.highlight,
                  colorsPrefs.selected,
                  bgPrefs.color,
                  bgPrefs.image
                 ],
                 function(err, result) {
                  if (err) {
                    throw err;
                  }
                  console.log("Player prefs updated (playerid=" + playerid);
                 }
    );
  }
}

function getRandomId(idLength) {
  var id = "",
      pool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  for (var i=0; i<idLength ;i++) {
    var rnd = Math.floor(Math.random() * (pool.length));
    id += pool.substring(rnd, rnd+1);
  }
  return id;
}

exports.playerExists          = playerExists;
exports.validateField         = validateField;
exports.login                 = login;
exports.play                  = play;
exports.newPlayer             = newPlayer;
exports.getGameData           = getGameData;
exports.getMostRecentMoveData = getMostRecentMoveData;

