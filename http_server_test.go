package httpserver

import (
	"fmt"
	"io"
	"net"
	"sync"
	"testing"
	"time"
)

func TestHttpServer(t *testing.T) {

	address := "127.0.0.1:42069"
	http := Server{Addr: address}

	serverErrorChan := make(chan error)

	go func() {
		if err := http.ListenAndServe(); err != nil {
			serverErrorChan <- err
		}
	}()

	time.Sleep(time.Second * 2)
	var wg sync.WaitGroup
	connectionErrorChan := make(chan error, 5)

	// Create 5 connections and send a request with each one
	for i := 1; i <= 5; i++ {
		wg.Add(1)

		go func() {
			defer wg.Done()

			conn, err := net.Dial("tcp", address)
			if err != nil {
				connectionErrorChan <- err
			}

			if _, err := conn.Write([]byte(fmt.Sprintf("GET /index%d.html\r\n", i))); err != nil {
				connectionErrorChan <- err
			}

			response := make([]byte, 1024)
			if _, err := conn.Read(response); err != nil {
				connectionErrorChan <- err
			}
		}()
	}

	wg.Wait()

	// Close the error channel after all goroutines finish
	go func() {
		wg.Wait()
		close(connectionErrorChan)
	}()

	// Collect errors
	for err := range connectionErrorChan {
		if err != nil && err != io.EOF {
			t.Error(err)
		}
	}
}
