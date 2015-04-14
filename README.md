# WinQ
Tiny web application where you can find quotes. 
I used HTML/CSS, AngularJS and ElasticSearch.

**ElasticSearch data example:**
```
{"_index":"quotes","_type":"quote","_id":"2","_version":1,"found":true,"_source":{ "text" : "Quality is not an act, it is a habit.", 
  "auth" : "Aristotle",
  "tags" : "quality, habit"
}
}
```

**Settings to add to ElasticSearch config file:**

```
http.jsonp.enable: true
http.cors.enabled : true
http.cors.allow-origin : "*"
http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length
```

Inspired by https://github.com/spalger/elasticsearch-angular-example
