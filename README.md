# SerialPortTool

A tool using Web APIs - Serial Port APIs to establish serial communication

See the [MDN Serial API](https://developer.mozilla.org/en-US/docs/Web/API/SerialPort)

## getPort

To search and match the ports of the current device, it would trigger a modal to select the port. Mark sure your sensor or others has connect to the device and check the COM port.

When your enter this page, it will search all ports you had matched before(use the serial getPorts method). If you don't remember the port or no matched port, you can click the getPort btn to pick up a port, it will be set to the form - Port.

## connectToPort

When you pick up a port and set up all required parameters, you can click the connectToPort btn to establish the serial communication.

Once it established, it will start reading data from the port. If you want to stop reading, you can click the cancelPort btn. And click startReader btn to start reading data again.

The data will be displayed in the Received box.

## cancelReader

stop reading the data from the port

## closePort

close the port, if the reader is on reading, it will cancel the reader first.

## saveContent

save the data into the content.txt file

## clearContent

clear the data in the Received box. It will also clear the cached data

## send

send data to the port

## clearMsg

clear the Received box. It will also clear the cached message.
