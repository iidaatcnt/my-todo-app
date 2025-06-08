'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Clock, ChevronUp, ChevronDown, Edit2, Save, X } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // 初期データの読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('保存されたTodoデータの読み込みに失敗しました:', error);
        setDefaultTodos();
      }
    } else {
      setDefaultTodos();
    }
    setIsLoaded(true);
  }, []);

  const setDefaultTodos = () => {
    const defaultTodos = [
      { id: 1, text: 'Claudeでアプリを作成', completed: true },
      { id: 2, text: 'Vercelにデプロイ', completed: false },
      { id: 3, text: 'アプリを公開', completed: false }
    ];
    setTodos(defaultTodos);
  };

  // Todoが変更されるたびにlocalStorageに保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = (): void => {
    if (inputText.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputText('');
    }
  };

  const toggleTodo = (id: number): void => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number): void => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    // 編集中のものを削除した場合、編集モードを終了
    if (editingId === id) {
      setEditingId(null);
      setEditingText('');
    }
  };

  // Todoの順番を上に移動
  const moveTodoUp = (index: number): void => {
    if (index > 0) {
      setTodos(prevTodos => {
        const newTodos = [...prevTodos];
        [newTodos[index], newTodos[index - 1]] = [newTodos[index - 1], newTodos[index]];
        return newTodos;
      });
    }
  };

  // Todoの順番を下に移動
  const moveTodoDown = (index: number): void => {
    setTodos(prevTodos => {
      if (index < prevTodos.length - 1) {
        const newTodos = [...prevTodos];
        [newTodos[index], newTodos[index + 1]] = [newTodos[index + 1], newTodos[index]];
        return newTodos;
      }
      return prevTodos;
    });
  };

  // 編集モードを開始
  const startEditing = (id: number, currentText: string): void => {
    setEditingId(id);
    setEditingText(currentText);
  };

  // 編集を保存
  const saveEdit = (): void => {
    if (editingText.trim() !== '' && editingId !== null) {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
        )
      );
    }
    setEditingId(null);
    setEditingText('');
  };

  // 編集をキャンセル
  const cancelEdit = (): void => {
    setEditingId(null);
    setEditingText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // 編集中のEnterキーとEscキーのハンドリング
  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const clearAllTodos = (): void => {
    if (window.confirm('全てのTodoを削除しますか？')) {
      setTodos([]);
      setEditingId(null);
      setEditingText('');
    }
  };

  const resetToDefault = (): void => {
    if (window.confirm('デフォルトのTodoにリセットしますか？')) {
      setDefaultTodos();
      setEditingId(null);
      setEditingText('');
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Todo List Pro
          </h1>
          <p className="text-gray-600">順番変更・編集機能付きTodoアプリ</p>
          <div className="mt-4 flex justify-center items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-1" />
              完了: {completedCount}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              残り: {totalCount - completedCount}
            </div>
          </div>
        </div>

        {/* 入力エリア */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>追加</span>
            </button>
          </div>
        </div>

        {/* Todoリスト */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>まだタスクがありません</p>
              <p className="text-sm">上の入力欄から新しいタスクを追加してください</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {todos.map((todo, index) => (
                <div
                  key={todo.id}
                  className={`p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 ${
                    todo.completed ? 'bg-green-50' : ''
                  }`}
                >
                  {/* 順番変更ボタン */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveTodoUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded transition-colors duration-200 ${
                        index === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveTodoDown(index)}
                      disabled={index === todos.length - 1}
                      className={`p-1 rounded transition-colors duration-200 ${
                        index === todos.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 完了チェックボックス */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3" />}
                  </button>
                  
                  {/* Todo内容 */}
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyPress={handleEditKeyPress}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200 p-1"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span
                          className={`flex-1 transition-all duration-200 cursor-pointer ${
                            todo.completed
                              ? 'text-gray-500 line-through'
                              : 'text-gray-800'
                          }`}
                          onDoubleClick={() => startEditing(todo.id, todo.text)}
                          title="ダブルクリックで編集"
                        >
                          {todo.text}
                        </span>
                        <button
                          onClick={() => startEditing(todo.id, todo.text)}
                          className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* 削除ボタン */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 進捗バー */}
        {totalCount > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">進捗</span>
              <span className="text-sm text-gray-500">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 操作説明 */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📖 使い方</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <ChevronUp className="w-4 h-4 text-blue-500" />
              <span>上下ボタンで順番変更</span>
            </div>
            <div className="flex items-center space-x-2">
              <Edit2 className="w-4 h-4 text-blue-500" />
              <span>編集ボタンまたはダブルクリックで編集</span>
            </div>
            <div className="flex items-center space-x-2">
              <Save className="w-4 h-4 text-green-500" />
              <span>Enterキーで保存</span>
            </div>
            <div className="flex items-center space-x-2">
              <X className="w-4 h-4 text-red-500" />
              <span>Escキーでキャンセル</span>
            </div>
          </div>
        </div>

        {/* 管理ボタン */}
        {totalCount > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex space-x-4 justify-center">
              <button
                onClick={clearAllTodos}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                全て削除
              </button>
              <button
                onClick={resetToDefault}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                デフォルトに戻す
              </button>
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>🚀 Todo List Pro - 高機能版</p>
          <p className="mt-1">💾 データは自動保存されます</p>
        </div>
      </div>
    </div>
  );
}