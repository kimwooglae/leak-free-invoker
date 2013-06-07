leak-free-invoker
=================

JavaScript library for leak free method call between window


* leak free invoke between iframe.
* leak free invoke between frame.
* leak free invoke between popup.

basic idea
----------
* serialize json, xml object before method call of other window
* deserialize json, xml object before method call of target window
* serialize json, xml object before result return from other window
* deserialize json, xml object before result return at source window
