# TypeO
A simple text share program.

## Install  
Just prepare a webhost that supports PHP,then upload the repo.  

## How to use  
Access the website and just Write! Share the link with your friends!  
Of course, everyone has their secrets.  

Use **Ctrl+L** to lock/unlock your text.  
Also, if you're using a phone,just **shake** to lock/unlock.  
**PS:** 
1. You can only unlock the text in the **current** session,after refreshing the page,you'll unable to unlock the text.  
2. Concerning sercurity, when you access the webpage with http protocol , you're unable to shake because of the disability of the event 'devicemotion',in that case ,I suggest you access it with **https** protocol.  

## Nginx rewrite rule.
```conf
if (!-e $request_filename)  
{  
    rewrite ^/(.*)$ /index.php?r=$1;  
}  

```  
With the rewrite rule , you need to change the path in **index.php**:  
```php
if(empty($r)){  
	header('Location: ?r='.$id);/*开了伪静态改这个！*/  
}else{  
```

## About  
My little program, just for sharing~  
-SomeBottle
