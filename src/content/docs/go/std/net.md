---
title: net
description: net
sidebar:
  order: 33
---

## HTTP

```go
package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Active    bool      `json:"active"`
	CreatedAt time.Time `json:"created_at"`
}

type UserStore struct {
	users  map[int]User
	mutex  sync.RWMutex
	nextID int
}

func NewUserStore() *UserStore {
	return &UserStore{
		users:  make(map[int]User),
		nextID: 1,
	}
}

func (s *UserStore) AddUser(name, email string) (User, error) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	user := User{
		ID:        s.nextID,
		Name:      name,
		Email:     email,
		Active:    true,
		CreatedAt: time.Now(),
	}

	s.users[s.nextID] = user
	s.nextID++
	return user, nil
}

func (s *UserStore) GetUser(id int) (User, error) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	user, ok := s.users[id]
	if !ok {
		return User{}, errors.New("user not found")
	}
	return user, nil
}

func (s *UserStore) GetList() ([]User, error) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	users := make([]User, 0, len(s.users))
	for _, user := range s.users {
		users = append(users, user)
	}
	return users, nil
}

// Handler
type UserHandler struct {
	store *UserStore
}

func NewUserHandler(store *UserStore) *UserHandler {
	return &UserHandler{
		store: store,
	}
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	type request struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	var req request
	if err := json.Unmarshal(body, &req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	if req.Name == "" || req.Email == "" {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	user, err := h.store.AddUser(req.Name, req.Email)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
	return
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// /users/1
	path := strings.TrimPrefix(r.URL.Path, "/users/")
	id, err := strconv.Atoi(path)
	if err != nil {
		http.Error(w, "Invalid user id", http.StatusBadRequest)
		return
	}

	user, err := h.store.GetUser(id)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
	return
}

// Config
type Config struct {
	Port     int    `json:"port"`
	logLevel string `json:"log_level"`
}

func LoadConfig(filename string) (*Config, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, fmt.Errorf("打开Config文件出错: %v", err)
	}
	defer file.Close()

	bytes, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("读取Config文件出错: %v", err)
	}

	var config Config
	err = json.Unmarshal(bytes, &config)
	if err != nil {
		return nil, fmt.Errorf("解析Config文件出错: %v", err)
	}

	return &config, nil
}

func WriteConfig(filename string, config *Config) error {
	file, err := os.Create(filename)
	if err != nil {
		return fmt.Errorf("创建Config文件出错: %v", err)
	}
	defer file.Close()

	bytes, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return fmt.Errorf("序列化Config文件出错: %v", err)
	}

	_, err = file.Write(bytes)
	if err != nil {
		return fmt.Errorf("写入Config文件出错: %v", err)
	}
	return nil
}

func main() {
	var configFile string
	var port int
	flag.StringVar(&configFile, "config", "config.json", "Config file path")
	flag.IntVar(&port, "port", 8080, "Server port")
	flag.Parse()

	config, err := LoadConfig(configFile)
	if err != nil {
		panic(err)
	}

	log.Println("Config:", config)

	userHandler := NewUserHandler(NewUserStore())
	http.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			userHandler.CreateUser(w, r)
			return
		case http.MethodGet:
			userHandler.GetUser(w, r)
			return
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
	})

	addr := fmt.Sprintf(":%d", config.Port)
	log.Fatal(http.ListenAndServe(addr, nil))
}
```

### http.FileServer

```go
package main

import "net/http"

func main() {
	serve := http.FileServer(http.Dir("."))
	http.ListenAndServe(":8080", serve)
}
```

## 路由

```go
package main

import "net/http"

func main() {
	// 创建路由实例
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	    w.Header.Set("Content-Type", "application/json")
		w.Write([]byte("Hello, World!"))
		w.WriteHeader(http.StatusOK)
	})

	http.ListenAndServe(":8080", mux)
}
```
